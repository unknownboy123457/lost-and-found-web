// Database schema definition for Lost & Found Information System (LFIS)
const DB_NAME = 'lfis_indexeddb';
const DB_VERSION = 4;

const STORES = {
  USERS: 'users',
  CATEGORIES: 'category_list',
  ITEMS: 'item_list',
  INQUIRIES: 'inquiry_list',
  SYSTEM_INFO: 'system_info',
  OTP_VERIFICATIONS: 'otp_verifications',
  CLAIMS: 'claims',
  DELIVERY_SCHEDULES: 'delivery_schedules',
  NOTIFICATIONS: 'notifications',
  HOMEPAGE_SECTIONS: 'homepage_sections',
  CMS_SECTIONS: 'cms_sections',
  CMS_PARTNERS: 'cms_partners',
  CMS_TESTIMONIALS: 'cms_testimonials',
  CMS_FAQS: 'cms_faqs',
  CMS_REVISIONS: 'cms_revisions',
  ADMIN_AUDIT_LOGS: 'admin_audit_logs'
};

if (typeof window !== 'undefined') {
  window.DB_NAME = DB_NAME;
  window.DB_VERSION = DB_VERSION;
  window.STORES = STORES;
}
