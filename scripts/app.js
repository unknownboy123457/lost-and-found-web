// Global UI and Application Helpers for Lost & Found System

let _jsLoaderTimeout = null;
function start_loader() {
  if ($('#preloader').length === 0) {
    $('body').append('<div id="preloader"><div class="loader-holder"><div></div><div></div><div></div><div></div></div></div>');
  }
  clearTimeout(_jsLoaderTimeout);
  _jsLoaderTimeout = setTimeout(function() {
    end_loader();
  }, 3500);
}

function end_loader() {
  clearTimeout(_jsLoaderTimeout);
  $('#preloader').remove();
}

$(window).on('load', function() {
  end_loader();
});

window.alert_toast = function(msg = 'TEST', bg = 'success', pos = '') {
  const alert = $('<div class="alert rounded-0 mb-2">');
  alert.addClass(`alert-${bg}`);
  alert.text(msg);
  $('#msg-container').html(alert);
  $("html, body, .modal").animate({ scrollTop: 0 }, "fast");
  setTimeout(() => {
    alert.fadeOut('slow', function() {
      $(this).remove();
    });
  }, 4000);
};

window.viewer_modal = function(src = '') {
  start_loader();
  const ext = src.split('.').pop().toLowerCase();
  let view;
  if (ext === 'mp4') {
    view = $("<video src='" + src + "' controls autoplay style='max-width:100%'></video>");
  } else {
    view = $("<img src='" + src + "' style='max-width:100%' />");
  }
  $('#viewer_modal .modal-content video, #viewer_modal .modal-content img').remove();
  $('#viewer_modal .modal-content').append(view);
  const myModal = new bootstrap.Modal(document.getElementById('viewer_modal'), {
    backdrop: 'static',
    keyboard: false
  });
  myModal.show();
  end_loader();
};

window.uni_modal = function(title = '', content = '', size = '') {
  start_loader();
  $('#uni_modal .modal-title').html(title);
  $('#uni_modal .modal-body').html(content);
  const dialog = $('#uni_modal .modal-dialog');
  dialog.removeAttr('class').addClass('modal-dialog modal-dialog-centered rounded-0');
  if (size !== '') {
    dialog.addClass(size);
  } else {
    dialog.addClass('modal-md');
  }
  const myModal = new bootstrap.Modal(document.getElementById('uni_modal'), {
    backdrop: 'static',
    keyboard: false
  });
  myModal.show();
  end_loader();
};

window._conf = function(msg = '', func = '', params = []) {
  $('#confirm_modal #confirm').off('click').on('click', function() {
    if (typeof func === 'function') {
      func.apply(null, params);
    } else if (typeof window[func] === 'function') {
      window[func].apply(null, params);
    }
    const modalEl = document.getElementById('confirm_modal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  });
  $('#confirm_modal .modal-body').html(msg);
  const myModal = new bootstrap.Modal(document.getElementById('confirm_modal'));
  myModal.show();
};

function format_num(number = '', decimal = '') {
  if (!isNaN(number)) {
    const num = Number(number);
    if (decimal !== '' && !isNaN(decimal)) {
      return num.toLocaleString('en-US', { minimumFractionDigits: Number(decimal), maximumFractionDigits: Number(decimal) });
    }
    return num.toLocaleString('en-US');
  }
  return '0';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
}

async function syncSystemBranding(rootPrefix = '') {
  let info = {};
  try {
    await window.db.init();
    info = (await window.db.getSystemInfo()) || {};
  } catch (e) {
    console.warn('Could not read system info from DB, using defaults:', e);
  }

  const defaultInfo = {
    name: 'Lost and Found Information System',
    short_name: 'PHP - LFIS',
    logo: 'uploads/logo.png',
    cover: 'uploads/cover.png',
    user_avatar: 'uploads/user_avatar.jpg',
    phone: '903-436-9356',
    mobile: '0917-351-8047',
    email: 'info@simpleorganization.org',
    address: '4226 Florence Street, Arlington, Texas, 76011',
    welcome: `
      <h1 style="text-align: center;">Welcome to Lost and Found Information System</h1>
      <p class="lead text-center mt-3">Our platform helps connect people with their lost items and allows finders to report discovered belongings safely and securely.</p>
      <p class="text-center text-muted">Browse our catalog to search for items lost recently, or sign in with your mobile number to report a found item.</p>
    `,
    about: `
      <h1 style="text-align: center;">About Us</h1>
      <p class="lead text-center mt-3">We provide a centralized platform to manage, locate, and return lost property effectively.</p>
    `
  };

  info = { ...defaultInfo, ...info };

  // Site title & name
  if (info.name) {
    document.title = (info.title ? info.title + ' | ' : '') + info.name;
    $('.siteTitle').text(info.name);
    $('[data-sys-name]').text(info.name);
  }
  if (info.short_name) {
    $('[data-sys-short-name]').text(info.short_name);
  }

  // Logo
  const logoUrl = window.StorageManager.getImageUrl(info.logo, 'uploads/logo.png', rootPrefix);
  $('img[alt="System Logo"]').attr('src', logoUrl);
  $('link[rel="icon"]').attr('href', logoUrl);

  // Cover image in public header
  if (info.cover) {
    const coverUrl = window.StorageManager.getImageUrl(info.cover, 'uploads/cover.png', rootPrefix);
    $('#site-header').css('--bg', `url("${coverUrl}")`);
  }

  return info;
}

if (typeof window !== 'undefined') {
  window.format_num = format_num;
  window.formatDate = formatDate;
  window.syncSystemBranding = syncSystemBranding;
}

