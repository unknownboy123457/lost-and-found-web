// Client-side authentication and session management using IndexedDB & Web Crypto

const AuthManager = {
  SESSION_KEY: 'lfis_user_session',

  /**
   * Hashes a password string using SHA-256 via Web Crypto API
   * @param {string} password 
   * @returns {Promise<string>}
   */
  async hashPassword(password) {
    if (!password) return '';
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Authenticates user against IndexedDB using Email OR Username
   * @param {string} identifier (Email or Username)
   * @param {string} password 
   * @returns {Promise<{ status: string, msg?: string, user?: object }>}
   */
  async login(identifier, password) {
    if (!identifier || !identifier.trim()) {
      return { status: 'failed', msg: 'Please enter your email or username.' };
    }
    if (!password) {
      return { status: 'failed', msg: 'Please enter your password.' };
    }

    await window.db.init();
    const cleanId = identifier.trim().toLowerCase();
    const users = await window.db.getAll('users');

    // Find by either email or username (case-insensitive)
    const user = users.find(u => 
      (u.email && u.email.trim().toLowerCase() === cleanId) || 
      (u.username && u.username.trim().toLowerCase() === cleanId)
    );

    if (!user) {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanId);
      if (isEmail) {
        return { status: 'not_found', msg: 'No account found with this email address. Please check your spelling or register.' };
      }
      return { status: 'not_found', msg: 'No account found with this username. Please check your spelling or register.' };
    }

    const inputHash = await this.hashPassword(password);
    // Allow matching hash OR fallback matching for initial demo ease
    const isValid = (user.password_hash === inputHash) ||
                    (user.username === 'admin' && (password === 'admin123' || password === 'admin')) ||
                    (user.username === 'cblake' && (password === 'password123' || password === 'admin123'));

    if (!isValid) {
      return { status: 'incorrect', msg: 'Incorrect password. Please try again.' };
    }

    const sessionUser = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      middlename: user.middlename || '',
      username: user.username,
      email: user.email || '',
      avatar: user.avatar || 'uploads/user_avatar.jpg',
      type: Number(user.type), // 1 = Administrator, 2 = Regular User/Staff
      login_type: Number(user.type),
      login_time: new Date().toISOString()
    };

    // Store in both sessionStorage and localStorage for rock-solid persistence across refreshes and tabs
    try {
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
      localStorage.setItem('lfis_last_identifier', user.email || user.username);
    } catch (e) {
      console.warn('Storage set note:', e);
    }

    return { status: 'success', user: sessionUser, msg: 'Login successful!' };
  },

  /**
   * Registers a new user account locally in IndexedDB
   * @param {object} userData 
   * @returns {Promise<{ status: string, msg?: string, user?: object }>}
   */
  async register(userData) {
    if (!userData.firstname || !userData.firstname.trim()) {
      return { status: 'failed', msg: 'Please enter your first name.' };
    }
    if (!userData.lastname || !userData.lastname.trim()) {
      return { status: 'failed', msg: 'Please enter your last name.' };
    }
    if (!userData.email || !userData.email.trim()) {
      return { status: 'failed', msg: 'Please enter your email address.' };
    }

    const cleanEmail = userData.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { status: 'failed', msg: 'Please provide a valid email address (e.g., name@example.com).' };
    }

    if (!userData.password || userData.password.length < 6) {
      return { status: 'failed', msg: 'Password must be at least 6 characters long.' };
    }

    if (userData.confirm_password !== undefined && userData.confirm_password !== userData.password) {
      return { status: 'failed', msg: 'Passwords do not match. Please re-enter your password.' };
    }

    await window.db.init();
    const users = await window.db.getAll('users');

    // 1. Prevent duplicate email accounts
    const emailExists = users.some(u => u.email && u.email.trim().toLowerCase() === cleanEmail);
    if (emailExists) {
      return { status: 'failed', msg: 'This email address is already registered. Please log in or use a different email.' };
    }

    // 2. Resolve & check username
    let cleanUsername = (userData.username || cleanEmail.split('@')[0]).trim().toLowerCase();
    // Sanitize username
    cleanUsername = cleanUsername.replace(/[^a-z0-9_.-]/g, '');
    if (!cleanUsername) cleanUsername = 'user_' + Date.now();

    const usernameExists = users.some(u => u.username && u.username.trim().toLowerCase() === cleanUsername);
    if (usernameExists) {
      if (userData.username) {
        return { status: 'failed', msg: 'This username is already taken. Please choose another username.' };
      }
      cleanUsername = cleanUsername + '_' + Math.floor(100 + Math.random() * 900);
    }

    // 3. Security: Public registration CANNOT grant Administrator privileges
    // Always assign type 2 (regular user/staff). Only pre-existing DB admins or admin-controlled invites can be Admin.
    const assignedType = 2;

    const passwordHash = await this.hashPassword(userData.password);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newUser = {
      firstname: userData.firstname.trim(),
      middlename: userData.middlename ? userData.middlename.trim() : '',
      lastname: userData.lastname.trim(),
      username: cleanUsername,
      email: cleanEmail,
      password_hash: passwordHash,
      avatar: userData.avatar || 'uploads/user_avatar.jpg',
      type: assignedType,
      date_added: now,
      date_updated: now
    };

    const newId = await window.db.add('users', newUser);
    newUser.id = newId;

    const sessionUser = {
      id: newUser.id,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      middlename: newUser.middlename,
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar,
      type: newUser.type,
      login_type: newUser.type,
      login_time: new Date().toISOString()
    };

    try {
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
      localStorage.setItem('lfis_last_identifier', newUser.email);
    } catch (e) {
      console.warn('Storage set note:', e);
    }

    return { status: 'success', user: sessionUser, msg: 'Account successfully registered!' };
  },

  /**
   * Logs out the current user and clears both session and local storage
   */
  logout(redirectUrl = 'login.html') {
    try {
      sessionStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.SESSION_KEY);
    } catch (e) {}
    window.location.href = redirectUrl;
  },

  /**
   * Gets currently logged in user from session with fallback to localStorage
   */
  getCurrentUser() {
    let raw = null;
    try {
      raw = sessionStorage.getItem(this.SESSION_KEY);
      if (!raw) {
        raw = localStorage.getItem(this.SESSION_KEY);
        if (raw) {
          // Re-hydrate sessionStorage
          sessionStorage.setItem(this.SESSION_KEY, raw);
        }
      }
    } catch (e) {}

    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Updates session data for currently logged in user
   */
  updateCurrentSession(updatedFields) {
    const user = this.getCurrentUser();
    if (!user) return;
    const merged = { ...user, ...updatedFields };
    try {
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(merged));
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(merged));
    } catch (e) {}
  },

  /**
   * Checks if current user is an Administrator
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return Boolean(user && Number(user.type) === 1);
  },

  /**
   * Checks if user is authenticated; if not, redirects
   */
  requireAuth(redirectUrl = 'login.html') {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = redirectUrl;
      return null;
    }
    return user;
  },

  /**
   * Enforces Admin access; if not admin, redirects away
   */
  requireAdmin(redirectUrl = '../login.html') {
    const user = this.getCurrentUser();
    if (!user || Number(user.type) !== 1) {
      alert('Access denied: Administrator privileges required.');
      window.location.href = redirectUrl;
      return null;
    }
    return user;
  },

  /**
   * Phase 1: Request OTP for Indian mobile number
   */
  async sendMobileOtp(mobile) {
    if (typeof window.OtpService === 'undefined') {
      return { status: 'failed', msg: 'OTP service is not loaded.' };
    }
    return await window.OtpService.generateOtp(mobile);
  },

  /**
   * Phase 1: Verify OTP and establish session
   */
  async verifyMobileOtp(mobile, otp) {
    if (typeof window.OtpService === 'undefined') {
      return { status: 'failed', msg: 'OTP service is not loaded.' };
    }
    const verifyRes = await window.OtpService.verifyOtp(mobile, otp);
    if (verifyRes.status !== 'success') {
      return verifyRes;
    }

    const cleanMobile = verifyRes.mobile;
    await window.db.init();
    const users = await window.db.getAll('users');
    const existing = users.find(u => u.mobile === cleanMobile || u.username === cleanMobile);

    if (existing) {
      const sessionUser = {
        id: existing.id,
        firstname: existing.firstname,
        lastname: existing.lastname,
        middlename: existing.middlename || '',
        username: existing.username,
        mobile: cleanMobile,
        email: existing.email || '',
        avatar: existing.avatar || 'uploads/user_avatar.jpg',
        type: existing.type || 3,
        login_type: existing.type || 3
      };
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
      return {
        status: 'success',
        is_new: false,
        msg: `Welcome back, ${existing.firstname}!`,
        user: sessionUser
      };
    }

    return {
      status: 'success',
      is_new: true,
      mobile: cleanMobile,
      msg: 'Mobile number verified! Please provide your name to finalize your account.'
    };
  },

  /**
   * Phase 1: Complete registration for new mobile user
   */
  async completeMobileRegistration(mobile, firstname, lastname, email) {
    const cleanMobile = window.OtpService.sanitizeMobile(mobile);
    if (!cleanMobile) {
      return { status: 'failed', msg: 'Invalid mobile number.' };
    }
    if (!firstname || !firstname.trim()) {
      return { status: 'failed', msg: 'First Name is required.' };
    }

    await window.db.init();
    const newUser = {
      firstname: firstname.trim(),
      lastname: (lastname || '').trim(),
      middlename: '',
      username: cleanMobile,
      mobile: cleanMobile,
      email: (email || '').trim(),
      password_hash: '',
      avatar: 'uploads/user_avatar.jpg',
      type: 3, // Regular end-user
      status: 1,
      date_added: new Date().toISOString().replace('T', ' ').substring(0, 19),
      date_updated: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    const newId = await window.db.add('users', newUser);
    newUser.id = newId;

    const sessionUser = {
      id: newId,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      middlename: '',
      username: cleanMobile,
      mobile: cleanMobile,
      email: newUser.email,
      avatar: newUser.avatar,
      type: 3,
      login_type: 3
    };

    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
    return {
      status: 'success',
      msg: 'Registration complete! Welcome to Lost & Found.',
      user: sessionUser
    };
  },

  /**
   * Get user display name
   */
  getUserDisplayName() {
    const u = this.getCurrentUser();
    if (!u) return 'Guest';
    const full = `${u.firstname || ''} ${u.lastname || ''}`.trim();
    return full || u.username || u.mobile || 'User';
  }
};

if (typeof window !== 'undefined') {
  window.AuthManager = AuthManager;
}

