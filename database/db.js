// IndexedDB database manager for Lost & Found Information System

class LfisDB {
  constructor() {
    this.db = null;
    this.initPromise = null;
  }

  async init() {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(window.DB_NAME || 'lfis_indexeddb', window.DB_VERSION || 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Categories store
        if (!db.objectStoreNames.contains('category_list')) {
          const catStore = db.createObjectStore('category_list', { keyPath: 'id', autoIncrement: true });
          catStore.createIndex('name', 'name', { unique: false });
          catStore.createIndex('status', 'status', { unique: false });
        }

        // Items store
        if (!db.objectStoreNames.contains('item_list')) {
          const itemStore = db.createObjectStore('item_list', { keyPath: 'id', autoIncrement: true });
          itemStore.createIndex('category_id', 'category_id', { unique: false });
          itemStore.createIndex('status', 'status', { unique: false });
          itemStore.createIndex('title', 'title', { unique: false });
        }

        // Inquiries store
        if (!db.objectStoreNames.contains('inquiry_list')) {
          const inqStore = db.createObjectStore('inquiry_list', { keyPath: 'id', autoIncrement: true });
          inqStore.createIndex('status', 'status', { unique: false });
        }

        // Users store
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
          userStore.createIndex('username', 'username', { unique: true });
          userStore.createIndex('type', 'type', { unique: false });
        }

        // System info store (key-value by meta_field)
        if (!db.objectStoreNames.contains('system_info')) {
          db.createObjectStore('system_info', { keyPath: 'meta_field' });
        }

        // OTP Verifications store (Phase 1)
        if (!db.objectStoreNames.contains('otp_verifications')) {
          const otpStore = db.createObjectStore('otp_verifications', { keyPath: 'id', autoIncrement: true });
          otpStore.createIndex('mobile', 'mobile', { unique: false });
          otpStore.createIndex('is_verified', 'is_verified', { unique: false });
          otpStore.createIndex('expires_at', 'expires_at', { unique: false });
        }

        // Claims store
        if (!db.objectStoreNames.contains('claims')) {
          const claimStore = db.createObjectStore('claims', { keyPath: 'id', autoIncrement: true });
          claimStore.createIndex('item_id', 'item_id', { unique: false });
          claimStore.createIndex('claimant_id', 'claimant_id', { unique: false });
          claimStore.createIndex('status', 'status', { unique: false });
        }

        // Delivery schedules store
        if (!db.objectStoreNames.contains('delivery_schedules')) {
          const schedStore = db.createObjectStore('delivery_schedules', { keyPath: 'id', autoIncrement: true });
          schedStore.createIndex('claim_id', 'claim_id', { unique: false });
          schedStore.createIndex('item_id', 'item_id', { unique: false });
        }

        // Notifications store
        if (!db.objectStoreNames.contains('notifications')) {
          const notifStore = db.createObjectStore('notifications', { keyPath: 'id', autoIncrement: true });
          notifStore.createIndex('user_id', 'user_id', { unique: false });
          notifStore.createIndex('is_read', 'is_read', { unique: false });
        }

        // Homepage sections store (legacy & new CMS)
        if (!db.objectStoreNames.contains('homepage_sections')) {
          const secStore = db.createObjectStore('homepage_sections', { keyPath: 'id', autoIncrement: true });
          secStore.createIndex('section_key', 'section_key', { unique: true });
        }

        // CMS Sections store
        if (!db.objectStoreNames.contains('cms_sections')) {
          const cmsSecStore = db.createObjectStore('cms_sections', { keyPath: 'id', autoIncrement: true });
          cmsSecStore.createIndex('section_key', 'section_key', { unique: true });
          cmsSecStore.createIndex('display_order', 'display_order', { unique: false });
        }

        // CMS Partners store
        if (!db.objectStoreNames.contains('cms_partners')) {
          const partnerStore = db.createObjectStore('cms_partners', { keyPath: 'id', autoIncrement: true });
          partnerStore.createIndex('display_order', 'display_order', { unique: false });
        }

        // CMS Testimonials store
        if (!db.objectStoreNames.contains('cms_testimonials')) {
          const testStore = db.createObjectStore('cms_testimonials', { keyPath: 'id', autoIncrement: true });
          testStore.createIndex('display_order', 'display_order', { unique: false });
        }

        // CMS FAQs store
        if (!db.objectStoreNames.contains('cms_faqs')) {
          const faqStore = db.createObjectStore('cms_faqs', { keyPath: 'id', autoIncrement: true });
          faqStore.createIndex('display_order', 'display_order', { unique: false });
        }

        // CMS Revisions store
        if (!db.objectStoreNames.contains('cms_revisions')) {
          const revStore = db.createObjectStore('cms_revisions', { keyPath: 'id', autoIncrement: true });
          revStore.createIndex('created_at', 'created_at', { unique: false });
        }

        // Admin audit logs store
        if (!db.objectStoreNames.contains('admin_audit_logs')) {
          const auditStore = db.createObjectStore('admin_audit_logs', { keyPath: 'id', autoIncrement: true });
          auditStore.createIndex('admin_id', 'admin_id', { unique: false });
        }
      };

      request.onsuccess = async (event) => {
        this.db = event.target.result;
        try {
          await this._seedDirect(this.db);
          await this._seedCMSDirect(this.db);
          resolve(this.db);
        } catch (err) {
          console.error('Error seeding initial data:', err);
          resolve(this.db);
        }
      };

      request.onerror = (event) => {
        console.error('IndexedDB error:', event.target.error);
        reject(event.target.error);
      };
    });

    return this.initPromise;
  }

  _seedDirect(db) {
    return new Promise((resolve) => {
      try {
        if (!window.SEED_DATA) return resolve();
        const tx = db.transaction(['system_info'], 'readonly');
        const req = tx.objectStore('system_info').count();
        req.onsuccess = () => {
          if (req.result === 0) {
            try {
              const writeTx = db.transaction(
                ['category_list', 'item_list', 'inquiry_list', 'users', 'system_info'],
                'readwrite'
              );
              if (window.SEED_DATA.categories) {
                const s = writeTx.objectStore('category_list');
                window.SEED_DATA.categories.forEach(c => s.put(c));
              }
              if (window.SEED_DATA.items) {
                const s = writeTx.objectStore('item_list');
                window.SEED_DATA.items.forEach(i => s.put(i));
              }
              if (window.SEED_DATA.inquiries) {
                const s = writeTx.objectStore('inquiry_list');
                window.SEED_DATA.inquiries.forEach(inq => s.put(inq));
              }
              if (window.SEED_DATA.users) {
                const s = writeTx.objectStore('users');
                window.SEED_DATA.users.forEach(u => s.put(u));
              }
              if (window.SEED_DATA.system_info) {
                const s = writeTx.objectStore('system_info');
                window.SEED_DATA.system_info.forEach(si => s.put(si));
              }
              writeTx.oncomplete = () => resolve();
              writeTx.onerror = () => resolve();
            } catch (wErr) {
              console.warn('Write seed error:', wErr);
              resolve();
            }
          } else {
            resolve();
          }
        };
        req.onerror = () => resolve();
      } catch (err) {
        console.warn('Direct seed error:', err);
        resolve();
      }
    });
  }

  _seedCMSDirect(db) {
    return new Promise((resolve) => {
      try {
        if (!window.SEED_DATA) return resolve();

        const storesToCheck = ['cms_sections', 'cms_partners', 'cms_testimonials', 'cms_faqs'].filter(s => db.objectStoreNames.contains(s));
        if (storesToCheck.length === 0) return resolve();

        const tx = db.transaction(storesToCheck, 'readwrite');
        
        if (db.objectStoreNames.contains('cms_sections') && window.SEED_DATA.cms_sections) {
          const store = tx.objectStore('cms_sections');
          const countReq = store.count();
          countReq.onsuccess = () => {
            if (countReq.result === 0) {
              window.SEED_DATA.cms_sections.forEach(sec => store.put(sec));
            }
          };
        }

        if (db.objectStoreNames.contains('cms_partners') && window.SEED_DATA.cms_partners) {
          const store = tx.objectStore('cms_partners');
          const countReq = store.count();
          countReq.onsuccess = () => {
            if (countReq.result === 0) {
              window.SEED_DATA.cms_partners.forEach(p => store.put(p));
            }
          };
        }

        if (db.objectStoreNames.contains('cms_testimonials') && window.SEED_DATA.cms_testimonials) {
          const store = tx.objectStore('cms_testimonials');
          const countReq = store.count();
          countReq.onsuccess = () => {
            if (countReq.result === 0) {
              window.SEED_DATA.cms_testimonials.forEach(t => store.put(t));
            }
          };
        }

        if (db.objectStoreNames.contains('cms_faqs') && window.SEED_DATA.cms_faqs) {
          const store = tx.objectStore('cms_faqs');
          const countReq = store.count();
          countReq.onsuccess = () => {
            if (countReq.result === 0) {
              window.SEED_DATA.cms_faqs.forEach(f => store.put(f));
            }
          };
        }

        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (err) {
        console.warn('CMS direct seed error:', err);
        resolve();
      }
    });
  }

  async ensureDB() {
    if (this.db) return this.db;
    return await this.init();
  }

  getTransaction(storeNames, mode = 'readonly') {
    return this.db.transaction(storeNames, mode);
  }

  async getAll(storeName) {
    await this.ensureDB();
    if (!this.db || !this.db.objectStoreNames.contains(storeName)) {
      return [];
    }
    return new Promise((resolve) => {
      try {
        const tx = this.getTransaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  }

  async getById(storeName, id) {
    await this.ensureDB();
    if (!this.db || !this.db.objectStoreNames.contains(storeName)) {
      return null;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.getTransaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const numericId = !isNaN(Number(id)) ? Number(id) : id;
        const request = store.get(numericId);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }

  async getByIndex(storeName, indexName, key) {
    await this.ensureDB();
    if (!this.db || !this.db.objectStoreNames.contains(storeName)) {
      return null;
    }
    return new Promise((resolve) => {
      try {
        const tx = this.getTransaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        if (!store.indexNames.contains(indexName)) {
          return resolve(null);
        }
        const index = store.index(indexName);
        const request = index.get(key);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }

  async add(storeName, item) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = this.getTransaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const copy = { ...item };
      if (!copy.id) delete copy.id;
      const request = store.add(copy);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addWithKey(storeName, item) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = this.getTransaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(item);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async put(storeName, item) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = this.getTransaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      if (item.id && !isNaN(Number(item.id))) {
        item.id = Number(item.id);
      }
      const request = store.put(item);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async update(storeName, item) {
    return await this.put(storeName, item);
  }

  async getAllByIndex(storeName, indexName, key) {
    await this.ensureDB();
    if (!this.db || !this.db.objectStoreNames.contains(storeName)) {
      return [];
    }
    return new Promise((resolve) => {
      try {
        const tx = this.getTransaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        if (!store.indexNames.contains(indexName)) {
          return resolve([]);
        }
        const index = store.index(indexName);
        const request = index.getAll(key);
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  }

  async delete(storeName, id) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = this.getTransaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const numericId = !isNaN(Number(id)) ? Number(id) : id;
      const request = store.delete(numericId);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async count(storeName) {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const tx = this.getTransaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getSystemInfo() {
    const list = await this.getAll('system_info');
    const result = {};
    for (const item of list) {
      result[item.meta_field] = item.meta_value;
    }
    return result;
  }

  async setSystemInfo(meta_field, meta_value) {
    return await this.put('system_info', { meta_field, meta_value });
  }

  async setSystemInfoBatch(obj) {
    for (const [key, value] of Object.entries(obj)) {
      await this.setSystemInfo(key, value);
    }
  }
}

// Global singleton instance
const db = new LfisDB();
if (typeof window !== 'undefined') {
  window.db = db;
}
