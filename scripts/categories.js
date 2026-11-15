// Category management operations for Lost & Found System

const CategoryManager = {
  async getAll(onlyActive = false) {
    try {
      await window.db.init();
      let categories = await window.db.getAll('category_list');
      if (!Array.isArray(categories) || categories.length === 0) {
        categories = (window.SEED_DATA && window.SEED_DATA.categories) ? window.SEED_DATA.categories : [];
      }
      if (onlyActive) {
        categories = categories.filter(c => Number(c.status) === 1);
      }
      return categories.sort((a, b) => a.name.localeCompare(b.name));
    } catch (e) {
      console.warn('CategoryManager.getAll fallback to SEED:', e);
      let categories = (window.SEED_DATA && window.SEED_DATA.categories) ? window.SEED_DATA.categories : [];
      if (onlyActive) {
        categories = categories.filter(c => Number(c.status) === 1);
      }
      return categories;
    }
  },

  async getById(id) {
    await window.db.init();
    return await window.db.getById('category_list', id);
  },

  async save(data) {
    await window.db.init();
    const existing = await window.db.getAll('category_list');
    
    // Check duplicate name
    const duplicate = existing.find(c => 
      c.name.trim().toLowerCase() === data.name.trim().toLowerCase() && 
      (!data.id || Number(c.id) !== Number(data.id))
    );

    if (duplicate) {
      return { status: 'failed', msg: 'Category Name already exists.' };
    }

    const record = {
      name: data.name.trim(),
      description: data.description ? data.description.trim() : '',
      status: Number(data.status),
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    if (data.id && Number(data.id) > 0) {
      record.id = Number(data.id);
      const original = await window.db.getById('category_list', record.id);
      record.created_at = original ? original.created_at : record.updated_at;
      await window.db.put('category_list', record);
      return { status: 'success', sid: record.id, msg: 'Category successfully updated.' };
    } else {
      record.created_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newId = await window.db.add('category_list', record);
      return { status: 'success', sid: newId, msg: 'New Category successfully saved.' };
    }
  },

  async delete(id) {
    await window.db.init();
    // Also handle cascade or warn if items belong to this category
    await window.db.delete('category_list', id);
    return { status: 'success', msg: 'Category successfully deleted.' };
  }
};

if (typeof window !== 'undefined') {
  window.CategoryManager = CategoryManager;
}

