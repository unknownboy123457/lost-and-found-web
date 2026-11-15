// Admin operations and dashboard statistics manager for Lost & Found System

const AdminManager = {
  async getDashboardStats() {
    await window.db.init();
    const categories = await window.db.getAll('category_list');
    const items = await window.db.getAll('item_list');
    const inquiries = await window.db.getAll('inquiry_list');

    const activeCategories = categories.filter(c => Number(c.status) === 1).length;
    const inactiveCategories = categories.filter(c => Number(c.status) === 0).length;
    const pendingItems = items.filter(i => Number(i.status) === 0).length;
    const publishedItems = items.filter(i => Number(i.status) === 1).length;
    const claimedItems = items.filter(i => Number(i.status) === 2).length;
    const unreadMessages = inquiries.filter(inq => Number(inq.status) === 0).length;

    const sysInfo = await window.db.getSystemInfo();
    let bannerImages = [];
    try {
      bannerImages = sysInfo.banner_images ? JSON.parse(sysInfo.banner_images) : [];
    } catch {
      bannerImages = ['uploads/banner/lf-wp-1.jpg', 'uploads/banner/lf-wp-2.jpg'];
    }

    return {
      activeCategories,
      inactiveCategories,
      pendingItems,
      publishedItems,
      claimedItems,
      unreadMessages,
      bannerImages
    };
  },

  async getAllUsers(excludeCurrentId = null) {
    await window.db.init();
    let users = await window.db.getAll('users');
    if (excludeCurrentId) {
      users = users.filter(u => Number(u.id) !== Number(excludeCurrentId));
    }
    return users.sort((a, b) => (a.firstname || '').localeCompare(b.firstname || ''));
  },

  async getUserById(id) {
    await window.db.init();
    return await window.db.getById('users', id);
  },

  async saveUser(data) {
    await window.db.init();
    const users = await window.db.getAll('users');
    const duplicate = users.find(u => 
      u.username.trim().toLowerCase() === data.username.trim().toLowerCase() && 
      (!data.id || Number(u.id) !== Number(data.id))
    );

    if (duplicate) {
      return { status: 'failed', msg: 'Username already exists.' };
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (data.id && Number(data.id) > 0) {
      const existing = await window.db.getById('users', data.id);
      if (!existing) return { status: 'failed', msg: 'User not found.' };

      existing.firstname = data.firstname.trim();
      existing.middlename = data.middlename ? data.middlename.trim() : '';
      existing.lastname = data.lastname.trim();
      existing.username = data.username.trim();
      if (data.type !== undefined) existing.type = Number(data.type);
      if (data.avatar) existing.avatar = data.avatar;
      existing.date_updated = now;

      if (data.password && data.password.trim() !== '') {
        existing.password_hash = await window.AuthManager.hashPassword(data.password);
      }

      await window.db.put('users', existing);

      // Update current session if the edited user is the logged-in user
      const currentUser = window.AuthManager.getCurrentUser();
      if (currentUser && Number(currentUser.id) === Number(existing.id)) {
        window.AuthManager.updateCurrentSession({
          firstname: existing.firstname,
          lastname: existing.lastname,
          middlename: existing.middlename,
          username: existing.username,
          avatar: existing.avatar,
          type: existing.type
        });
      }

      return { status: 'success', id: existing.id, msg: 'User Details successfully updated.' };
    } else {
      const passwordHash = await window.AuthManager.hashPassword(data.password || 'admin123');
      const newUser = {
        firstname: data.firstname.trim(),
        middlename: data.middlename ? data.middlename.trim() : '',
        lastname: data.lastname.trim(),
        username: data.username.trim(),
        password_hash: passwordHash,
        avatar: data.avatar || 'uploads/user_avatar.jpg',
        type: data.type !== undefined ? Number(data.type) : 2,
        date_added: now,
        date_updated: now
      };

      const newId = await window.db.add('users', newUser);
      return { status: 'success', id: newId, msg: 'User Details successfully saved.' };
    }
  },

  async deleteUser(id) {
    await window.db.init();
    await window.db.delete('users', id);
    return { status: 'success', msg: 'User successfully deleted.' };
  },

  async updateSystemInfo(infoObj) {
    await window.db.init();
    await window.db.setSystemInfoBatch(infoObj);
    return { status: 'success', msg: 'System Information has been updated successfully.' };
  },

  async updatePageContent(type, content) {
    await window.db.init();
    await window.db.setSystemInfo(type, content);
    return { status: 'success', msg: 'Page Content has been updated successfully.' };
  },

  async deleteBannerImage(imgPath) {
    await window.db.init();
    const sysInfo = await window.db.getSystemInfo();
    let banners = [];
    try {
      banners = sysInfo.banner_images ? JSON.parse(sysInfo.banner_images) : [];
    } catch {
      banners = [];
    }
    banners = banners.filter(p => p !== imgPath);
    await window.db.setSystemInfo('banner_images', JSON.stringify(banners));
    return { status: 'success', msg: 'Image Successfully Deleted.' };
  },

  async addBannerImage(dataUrlOrPath) {
    await window.db.init();
    const sysInfo = await window.db.getSystemInfo();
    let banners = [];
    try {
      banners = sysInfo.banner_images ? JSON.parse(sysInfo.banner_images) : [];
    } catch {
      banners = [];
    }
    banners.push(dataUrlOrPath);
    await window.db.setSystemInfo('banner_images', JSON.stringify(banners));
    return { status: 'success', msg: 'Banner image added.' };
  }
};

if (typeof window !== 'undefined') {
  window.AdminManager = AdminManager;
}

