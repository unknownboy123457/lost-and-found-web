// Inquiries and Contact Messages manager for Lost & Found System

const InquiryManager = {
  async getAll() {
    await window.db.init();
    const inquiries = await window.db.getAll('inquiry_list');
    return inquiries.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status - b.status; // unread (0) first
      }
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });
  },

  async getById(id, markAsRead = true) {
    await window.db.init();
    const inquiry = await window.db.getById('inquiry_list', id);
    if (inquiry && markAsRead && Number(inquiry.status) === 0) {
      inquiry.status = 1;
      inquiry.updated_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
      await window.db.put('inquiry_list', inquiry);
    }
    return inquiry;
  },

  async save(data) {
    await window.db.init();
    const isVisitor = data.visitor !== undefined;

    const record = {
      fullname: data.fullname ? data.fullname.trim() : '',
      contact: data.contact ? data.contact.trim() : '',
      email: data.email ? data.email.trim() : '',
      message: data.message ? data.message.trim() : '',
      status: 0, // unread by default
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updated_at: null
    };

    const newId = await window.db.add('inquiry_list', record);
    const msg = isVisitor
      ? "Your Message has been sent successfully. We will reach out using your contact information as soon as we see your message. Thank you!"
      : "New Inquiry successfully saved.";

    return { status: 'success', id: newId, msg };
  },

  async delete(id) {
    await window.db.init();
    await window.db.delete('inquiry_list', id);
    return { status: 'success', msg: 'Inquiry successfully deleted.' };
  },

  async getUnreadCount() {
    await window.db.init();
    const list = await window.db.getAll('inquiry_list');
    return list.filter(i => Number(i.status) === 0).length;
  }
};

if (typeof window !== 'undefined') {
  window.InquiryManager = InquiryManager;
}

