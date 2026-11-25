const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = 8080;
const REPORT_PORT = 5500;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-store, no-cache');

  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(BASE_DIR, path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, ''));

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

let reportResolve;
const reportPromise = new Promise(resolve => { reportResolve = resolve; });

const reportServer = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const url = new URL(req.url, `http://localhost:${REPORT_PORT}`);
  
  if (url.searchParams.has('step_pass')) {
    console.log(`[PASS] Step ${url.searchParams.get('step_pass')}`);
  }
  if (url.searchParams.has('step_fail')) {
    console.error(`[FAIL] Step ${url.searchParams.get('step_fail')}: ${url.searchParams.get('err')}`);
  }
  if (url.searchParams.has('test_report')) {
    const report = url.searchParams.get('test_report');
    console.log(`\n============================\nFINAL REPORT: ${report}\n============================`);
    reportResolve(report);
  }

  res.writeHead(200);
  res.end('OK');
});

async function main() {
  server.listen(PORT);
  reportServer.listen(REPORT_PORT);
  console.log(`Server listening on ${PORT}, report on ${REPORT_PORT}`);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeArgs = [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-allow-origins=*',
    `http://localhost:${PORT}/test.html`
  ];

  console.log(`Launching headless Chrome...`);
  const chrome = spawn(chromePath, chromeArgs);

  const timeout = setTimeout(() => {
    console.error('Timed out waiting for test report (30s)');
    reportResolve('TIMEOUT');
  }, 30000);

  const result = await reportPromise;
  clearTimeout(timeout);

  try { chrome.kill(); } catch (e) {}
  server.close();
  reportServer.close();

  if (result.startsWith('SUCCESS')) {
    console.log('\n>>> ALL TEST CASES PASSED SUCCESSFULLY! <<<');
    process.exit(0);
  } else {
    console.error('\n>>> TEST SUITE FAILED OR TIMED OUT: ' + result + ' <<<');
    process.exit(1);
  }
}

main();
