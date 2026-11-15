// CMS Manager for Pure JS / IndexedDB Architecture
class CMSManager {
  constructor() {
    this.ready = false;
  }

  async ensureReady() {
    await window.db.init();
    this.ready = true;
  }

  // 1. Sections Management
  async getSections(isAdmin = false) {
    try {
      await this.ensureReady();
      let sections = await window.db.getAll('cms_sections');
      if (!sections || sections.length === 0) {
        sections = window.SEED_DATA && window.SEED_DATA.cms_sections ? window.SEED_DATA.cms_sections : [];
      }
      if (!isAdmin) {
        sections = sections.filter(s => Number(s.is_active) === 1);
      }
      sections.sort((a, b) => Number(a.display_order) - Number(b.display_order));
      
      const map = {};
      sections.forEach(s => {
        let extra = {};
        if (s.extra_data) {
          try {
            extra = typeof s.extra_data === 'string' ? JSON.parse(s.extra_data) : s.extra_data;
          } catch (e) {
            extra = {};
          }
        }
        map[s.section_key] = { ...s, extra_data_parsed: extra };
      });

      // Always guarantee at least the 8 default sections exist
      if (Object.keys(map).length === 0 && window.SEED_DATA && window.SEED_DATA.cms_sections) {
        window.SEED_DATA.cms_sections.forEach(s => {
          let extra = {};
          try { extra = JSON.parse(s.extra_data); } catch(e) {}
          map[s.section_key] = { ...s, extra_data_parsed: extra };
        });
      }

      return map;
    } catch (err) {
      console.error('Error fetching CMS sections, using SEED fallback:', err);
      const map = {};
      if (window.SEED_DATA && window.SEED_DATA.cms_sections) {
        window.SEED_DATA.cms_sections.forEach(s => {
          let extra = {};
          try { extra = JSON.parse(s.extra_data); } catch(e) {}
          map[s.section_key] = { ...s, extra_data_parsed: extra };
        });
      }
      return map;
    }
  }

  async getSection(key) {
    const sections = await this.getSections(true);
    return sections[key] || null;
  }

  async saveSection(data) {
    await this.ensureReady();
    try {
      const existing = await window.db.getByIndex('cms_sections', 'section_key', data.section_key);
      const record = {
        ...(existing || {}),
        section_key: data.section_key,
        title: data.title !== undefined ? data.title : (existing ? existing.title : ''),
        subtitle: data.subtitle !== undefined ? data.subtitle : (existing ? existing.subtitle : ''),
        content: data.content !== undefined ? data.content : (existing ? existing.content : ''),
        image_path: data.image_path !== undefined ? data.image_path : (existing ? existing.image_path : null),
        extra_data: typeof data.extra_data === 'object' ? JSON.stringify(data.extra_data) : data.extra_data,
        is_active: data.is_active !== undefined ? Number(data.is_active) : (existing ? existing.is_active : 1),
        display_order: data.display_order !== undefined ? Number(data.display_order) : (existing ? existing.display_order : 0),
        updated_at: new Date().toISOString()
      };

      if (existing && existing.id) {
        record.id = existing.id;
        await window.db.update('cms_sections', record);
      } else {
        await window.db.add('cms_sections', record);
      }
      return { status: 'success', msg: 'Section settings saved successfully!' };
    } catch (err) {
      console.error('Error saving section:', err);
      return { status: 'failed', msg: err.message };
    }
  }

  async reorderSections(ordersMap) {
    await this.ensureReady();
    try {
      for (const [key, order] of Object.entries(ordersMap)) {
        const item = await window.db.getByIndex('cms_sections', 'section_key', key);
        if (item) {
          item.display_order = Number(order);
          await window.db.update('cms_sections', item);
        }
      }
      return { status: 'success', msg: 'Sections reordered successfully!' };
    } catch (err) {
      return { status: 'failed', msg: err.message };
    }
  }

  async toggleSection(sectionKey, isActive) {
    await this.ensureReady();
    try {
      const item = await window.db.getByIndex('cms_sections', 'section_key', sectionKey);
      if (item) {
        item.is_active = isActive ? 1 : 0;
        await window.db.update('cms_sections', item);
        return { status: 'success', msg: `Section ${isActive ? 'enabled' : 'hidden'}.` };
      }
      return { status: 'failed', msg: 'Section not found' };
    } catch (err) {
      return { status: 'failed', msg: err.message };
    }
  }

  // 2. Partners Management
  async getPartners(isAdmin = false) {
    try {
      await this.ensureReady();
      let partners = await window.db.getAll('cms_partners');
      if (!partners || partners.length === 0) {
        partners = window.SEED_DATA && window.SEED_DATA.cms_partners ? window.SEED_DATA.cms_partners : [];
      }
      if (!isAdmin) {
        partners = partners.filter(p => Number(p.is_active) === 1);
      }
      partners.sort((a, b) => Number(a.display_order) - Number(b.display_order));
      return partners;
    } catch (err) {
      console.error('Error fetching partners, using SEED fallback:', err);
      return (window.SEED_DATA && window.SEED_DATA.cms_partners) ? window.SEED_DATA.cms_partners : [];
    }
  }

  async savePartner(data) {
    await this.ensureReady();
    try {
      const record = {
        name: data.name || '',
        logo_path: data.logo_path || '',
        website_url: data.website_url || '',
        display_order: Number(data.display_order) || 0,
        is_active: data.is_active !== undefined ? Number(data.is_active) : 1
      };
      if (data.id) {
        record.id = Number(data.id);
        await window.db.update('cms_partners', record);
      } else {
        record.created_at = new Date().toISOString();
        await window.db.add('cms_partners', record);
      }
      return { status: 'success', msg: 'Partner saved successfully!' };
    } catch (err) {
      return { status: 'failed', msg: err.message };
    }
  }

  async deletePartner(id) {
    await this.ensureReady();
    try {
      await window.db.delete('cms_partners', Number(id));
      return { status: 'success', msg: 'Partner deleted successfully!' };
    } catch (err) {
      return { status: 'failed', msg: err.message };
    }
  }

  // 3. Testimonials Management
  async getTestimonials(isAdmin = false) {
    try {
      await this.ensureReady();
      let items = await window.db.getAll('cms_testimonials');
      if (!items || items.length === 0) {
        items = window.SEED_DATA && window.SEED_DATA.cms_testimonials ? window.SEED_DATA.cms_testimonials : [];
      }
      if (!isAdmin) {
        items = items.filter(t => Number(t.is_active) === 1);
      }
      items.sort((a, b) => Number(a.display_order) - Number(b.display_order));
      return items;
    } catch (err) {
      console.error('Error fetching testimonials, using SEED fallback:', err);
      return (window.SEED_DATA && window.SEED_DATA.cms_testimonials) ? window.SEED_DATA.cms_testimonials : [];
    }
  }

  async saveTestimonial(data) {
    await this.ensureReady();
    try {
      const record = {
        author_name: data.author_name || '',
        author_role: data.author_role || '',
        avatar_path: data.avatar_path || 'uploads/cms/testimonials/harsh.jpg',
        rating: Number(data.rating) || 5,
        headline: data.headline || '',
        review_text: data.review_text || '',
        display_order: Number(data.display_order) || 0,
        is_active: data.is_active !== undefined ? Number(data.is_active) : 1
      };
      if (data.id) {
        record.id = Number(data.id);
        await window.db.update('cms_testimonials', record);
      } else {
        record.created_at = new Date().toISOString();
        await window.db.add('cms_testimonials', record);
      }
      return { status: 'success', msg: 'Testimonial saved successfully!' };
    } catch (err) {
      return { status: 'failed', msg: err.message };
    }
  }

  async deleteTestimonial(id) {
    await this.ensureReady();
    try {
      await window.db.delete('cms_testimonials', Number(id));
      return { status: 'success', msg: 'Testimonial deleted successfully!' };
    } catch (err) {
      return { status: 'failed', msg: err.message };
    }
  }

  // 4. FAQs Management
  async getFaqs(isAdmin = false) {
    try {
      await this.ensureReady();
      let faqs = await window.db.getAll('cms_faqs');
      if (!faqs || faqs.length === 0) {
        faqs = window.SEED_DATA && window.SEED_DATA.cms_faqs ? window.SEED_DATA.cms_faqs : [];
      }
      if (!isAdmin) {
        faqs = faqs.filter(f => Number(f.is_active) === 1);
      }
      faqs.sort((a, b) => Number(a.display_order) - Number(b.display_order));
      return faqs;
    } catch (err) {
      console.error('Error fetching faqs, using SEED fallback:', err);
      return (window.SEED_DATA && window.SEED_DATA.cms_faqs) ? window.SEED_DATA.cms_faqs : [];
    }
  }

  async saveFaq(data) {
    await this.ensureReady();
    try {
      const record = {
        question: data.question || '',
        answer: data.answer || '',
        category: data.category || 'General',
        display_order: Number(data.display_order) || 0,
        is_active: data.is_active !== undefined ? Number(data.is_active) : 1
      };
      if (data.id) {
        record.id = Number(data.id);
        await window.db.update('cms_faqs', record);
      } else {
        record.created_at = new Date().toISOString();
        await window.db.add('cms_faqs', record);
      }
      return { status: 'success', msg: 'FAQ item saved successfully!' };
    } catch (err) {
      return { status: 'failed', msg: err.message };
    }
  }

  async deleteFaq(id) {
    await this.ensureReady();
    try {
      await window.db.delete('cms_faqs', Number(id));
      return { status: 'success', msg: 'FAQ item deleted successfully!' };
    } catch (err) {
      return { status: 'failed', msg: err.message };
    }
  }

  // 5. Revision & Rollback
  async publishHomepage() {
    await this.ensureReady();
    try {
      const sections = await this.getSections(true);
      const partners = await this.getPartners(true);
      const testimonials = await this.getTestimonials(true);
      const faqs = await this.getFaqs(true);

      const snapshot = {
        sections,
        partners,
        testimonials,
        faqs,
        published_at: new Date().toISOString()
      };

      const dateStr = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      await window.db.add('cms_revisions', {
        revision_name: `Published on ${dateStr}`,
        snapshot_data: JSON.stringify(snapshot),
        created_at: new Date().toISOString()
      });

      return { status: 'success', msg: 'Homepage published live and revision archived successfully!' };
    } catch (err) {
      return { status: 'failed', msg: err.message };
    }
  }

  async getRevisions() {
    await this.ensureReady();
    try {
      const revs = await window.db.getAll('cms_revisions');
      revs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return revs.slice(0, 15);
    } catch (err) {
      return [];
    }
  }

  async rollbackRevision(id) {
    await this.ensureReady();
    try {
      const rev = await window.db.getById('cms_revisions', Number(id));
      if (!rev) return { status: 'failed', msg: 'Revision not found' };

      const snapshot = JSON.parse(rev.snapshot_data);
      if (snapshot.sections) {
        for (const sec of Object.values(snapshot.sections)) {
          await this.saveSection(sec);
        }
      }
      return { status: 'success', msg: 'Homepage restored to selected revision successfully!' };
    } catch (err) {
      return { status: 'failed', msg: err.message };
    }
  }
}

if (typeof window !== 'undefined') {
  window.CMSManager = new CMSManager();
}

