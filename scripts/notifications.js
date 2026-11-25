// User and System Notifications Manager for Lost & Found Information System

const NotificationManager = {
  async send(userId, { title, message, type = 'info', link = '' }) {
    await window.db.init();
    const record = {
      user_id: Number(userId),
      title: title ? title.trim() : 'Notification',
      message: message ? message.trim() : '',
      type: type, // 'info', 'success', 'warning', 'danger'
      link: link || '',
      is_read: 0,
      created_at: new Date().toISOString()
    };
    const id = await window.db.add('notifications', record);
    record.id = id;
    return record;
  },

  async getByUser(userId) {
    if (!userId) return [];
    await window.db.init();
    const all = await window.db.getAll('notifications');
    const userNotifs = all.filter(n => Number(n.user_id) === Number(userId));
    return userNotifs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getUnreadCount(userId) {
    if (!userId) return 0;
    const list = await this.getByUser(userId);
    return list.filter(n => Number(n.is_read) === 0).length;
  },

  async markAsRead(id) {
    await window.db.init();
    const notif = await window.db.getById('notifications', id);
    if (notif) {
      notif.is_read = 1;
      await window.db.put('notifications', notif);
    }
    return { status: 'success' };
  },

  async markAllAsRead(userId) {
    if (!userId) return;
    await window.db.init();
    const list = await this.getByUser(userId);
    for (const n of list) {
      if (Number(n.is_read) === 0) {
        n.is_read = 1;
        await window.db.put('notifications', n);
      }
    }
    return { status: 'success' };
  }
};

if (typeof window !== 'undefined') {
  window.NotificationManager = NotificationManager;
}
