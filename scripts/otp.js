// ========================================================
// Client-side Mobile OTP Service (LFIS Phase 1 Engine)
// Mirrors classes/OtpService.php logic using IndexedDB & Web APIs
// ========================================================

const OtpService = {
  demo_mode: true,

  /**
   * Sanitizes and validates an Indian mobile number.
   * Accepts: +91 9876543210, 919876543210, 09876543210, 9876543210
   * Returns: 10-digit string or false
   */
  sanitizeMobile(mobile) {
    if (!mobile) return false;
    let digits = String(mobile).replace(/\D/g, '');
    digits = digits.replace(/^0+/, '');
    if (digits.length === 12 && digits.startsWith('91')) {
      digits = digits.substring(2);
    }
    if (/^[6-9]\d{9}$/.test(digits)) {
      return digits;
    }
    return false;
  },

  /**
   * Generate and send an OTP code
   */
  async generateOtp(mobile) {
    const cleanMobile = this.sanitizeMobile(mobile);
    if (!cleanMobile) {
      return {
        status: 'failed',
        msg: 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).'
      };
    }

    await window.db.init();
    const now = Date.now();

    // Check existing records for rate limiting
    let records = [];
    try {
      records = await window.db.getAll('otp_verifications');
    } catch {
      records = [];
    }

    const mobileRecords = records.filter(r => r.mobile === cleanMobile);
    mobileRecords.sort((a, b) => (b.id || 0) - (a.id || 0));

    // 1. Cooldown check: 60 seconds
    if (mobileRecords.length > 0) {
      const latest = mobileRecords[0];
      const diffSec = Math.floor((now - new Date(latest.created_at).getTime()) / 1000);
      if (diffSec < 60) {
        const wait = 60 - diffSec;
        return {
          status: 'cooldown',
          msg: `Please wait ${wait} second(s) before requesting a new OTP.`,
          wait_seconds: wait
        };
      }
    }

    // 2. Window check: Max 3 requests in last 10 minutes (600,000 ms)
    const tenMinAgo = now - (10 * 60 * 1000);
    const recentRequests = mobileRecords.filter(r => new Date(r.created_at).getTime() >= tenMinAgo);
    if (recentRequests.length >= 3) {
      return {
        status: 'failed',
        msg: 'Too many OTP requests. For security reasons, please wait 10 minutes.'
      };
    }

    // 3. Generate secure 6-digit random code
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const code = String(100000 + (array[0] % 900000));

    // Expiration: 5 minutes from now
    const expiresAt = new Date(now + (5 * 60 * 1000)).toISOString();
    const createdAt = new Date(now).toISOString();

    const record = {
      mobile: cleanMobile,
      otp_code: code,
      demo_otp: code,
      expires_at: expiresAt,
      attempts: 0,
      is_verified: 0, // 0 = pending, 1 = verified, 2 = expired/locked
      created_at: createdAt
    };

    try {
      const recordId = await window.db.add('otp_verifications', record);
      record.id = recordId;
    } catch (e) {
      console.warn('Could not persist OTP in IndexedDB, using session storage:', e);
    }

    // Always keep latest active OTP in session for instant verification
    sessionStorage.setItem('lfis_active_otp_' + cleanMobile, JSON.stringify(record));

    return {
      status: 'success',
      msg: `OTP sent successfully to +91 ${cleanMobile}.`,
      mobile: cleanMobile,
      is_demo: this.demo_mode,
      demo_otp: code,
      demo_notice: `DEMO MODE: Use code ${code} to log in. In production, this would be delivered via SMS.`,
      expires_in_seconds: 300,
      cooldown_seconds: 60
    };
  },

  /**
   * Verify OTP code
   */
  async verifyOtp(mobile, otp) {
    const cleanMobile = this.sanitizeMobile(mobile);
    if (!cleanMobile) {
      return { status: 'failed', msg: 'Invalid mobile number.' };
    }

    const cleanOtp = String(otp || '').trim();
    if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      return { status: 'failed', msg: 'Please enter a valid 6-digit numerical OTP.' };
    }

    await window.db.init();

    // Check session or DB
    let record = null;
    const sessionRaw = sessionStorage.getItem('lfis_active_otp_' + cleanMobile);
    if (sessionRaw) {
      try { record = JSON.parse(sessionRaw); } catch {}
    }

    if (!record) {
      try {
        const records = await window.db.getAll('otp_verifications');
        const pending = records.filter(r => r.mobile === cleanMobile && r.is_verified === 0);
        pending.sort((a, b) => (b.id || 0) - (a.id || 0));
        if (pending.length > 0) record = pending[0];
      } catch {}
    }

    if (!record) {
      return { status: 'failed', msg: 'No active OTP request found. Please request a new OTP.' };
    }

    const now = Date.now();
    const expireTime = new Date(record.expires_at).getTime();

    // Check expiration
    if (now > expireTime) {
      record.is_verified = 2;
      sessionStorage.removeItem('lfis_active_otp_' + cleanMobile);
      return { status: 'expired', msg: 'This OTP has expired (valid for 5 minutes). Please request a new OTP.' };
    }

    // Check attempts limit (max 5)
    if (record.attempts >= 5) {
      record.is_verified = 2;
      sessionStorage.removeItem('lfis_active_otp_' + cleanMobile);
      return { status: 'locked', msg: 'Maximum verification attempts exceeded. Please request a new OTP.' };
    }

    // Verify code
    if (cleanOtp !== record.otp_code && cleanOtp !== record.demo_otp) {
      record.attempts = (record.attempts || 0) + 1;
      const remaining = 5 - record.attempts;
      sessionStorage.setItem('lfis_active_otp_' + cleanMobile, JSON.stringify(record));

      if (remaining <= 0) {
        return { status: 'locked', msg: 'Incorrect OTP. Maximum attempts exceeded. Please request a new OTP.' };
      }
      return {
        status: 'failed',
        msg: `Incorrect OTP code. You have ${remaining} attempt(s) remaining.`,
        remaining_attempts: remaining
      };
    }

    // Success!
    record.is_verified = 1;
    sessionStorage.removeItem('lfis_active_otp_' + cleanMobile);
    try {
      if (record.id) await window.db.update('otp_verifications', record);
    } catch {}

    return {
      status: 'success',
      msg: 'Mobile number verified successfully!',
      mobile: cleanMobile
    };
  }
};

if (typeof window !== 'undefined') {
  window.OtpService = OtpService;
}

