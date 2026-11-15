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
   * Authenticates user against IndexedDB
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<{ status: string, msg?: string, user?: object }>}
   */
  async login(username, password) {
    await window.db.init();
    const users = await window.db.getAll('users');
    const user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());

    if (!user) {
      return { status: 'incorrect', msg: 'Incorrect username or password.' };
    }

    const inputHash = await this.hashPassword(password);
    // Allow either matching hash OR fallback matching for initial demo ease
    const isValid = (user.password_hash === inputHash) ||
                    (user.username === 'admin' && (password === 'admin123' || password === 'admin')) ||
                    (user.username === 'cblake' && (password === 'password123' || password === 'admin123'));

    if (isValid) {
      const sessionUser = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        middlename: user.middlename || '',
        username: user.username,
        avatar: user.avatar || 'uploads/user_avatar.jpg',
        type: user.type, // 1 = Administrator, 2 = Staff
        login_type: user.type
      };
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
      localStorage.setItem('lfis_last_username', user.username);
      return { status: 'success', user: sessionUser };
    } else {
      return { status: 'incorrect', msg: 'Incorrect username or password.' };
    }
  },

  /**
   * Registers a new user account locally in IndexedDB
   * @param {object} userData 
   * @returns {Promise<{ status: string, msg?: string, user?: object }>}
   */
  async register(userData) {
    await window.db.init();
    const users = await window.db.getAll('users');
    const exists = users.some(u => u.username.toLowerCase() === userData.username.trim().toLowerCase());

    if (exists) {
      return { status: 'failed', msg: 'Username already exists. Please choose a different one.' };
    }

    const passwordHash = await this.hashPassword(userData.password);
    const newUser = {
      firstname: userData.firstname.trim(),
      middlename: userData.middlename ? userData.middlename.trim() : '',
      lastname: userData.lastname.trim(),
      username: userData.username.trim(),
      password_hash: passwordHash,
      avatar: userData.avatar || 'uploads/user_avatar.jpg',
      type: userData.type ? Number(userData.type) : 2, // default Staff / regular
      date_added: new Date().toISOString().replace('T', ' ').substring(0, 19),
      date_updated: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    const newId = await window.db.add('users', newUser);
    newUser.id = newId;

    const sessionUser = {
      id: newUser.id,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      middlename: newUser.middlename,
      username: newUser.username,
      avatar: newUser.avatar,
      type: newUser.type,
      login_type: newUser.type
    };

    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
    return { status: 'success', user: sessionUser };
  },

  /**
   * Logs out the current user
   */
  logout(redirectUrl = 'login.html') {
    sessionStorage.removeItem(this.SESSION_KEY);
    window.location.href = redirectUrl;
  },

  /**
   * Gets currently logged in user from session
   */
  getCurrentUser() {
    const raw = sessionStorage.getItem(this.SESSION_KEY);
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
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(merged));
  },

  /**
   * Checks if current user is an Administrator
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return user && Number(user.type) === 1;
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

