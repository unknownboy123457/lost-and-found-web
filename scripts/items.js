// Item management operations (Lost & Found reports) for Lost & Found System

const ItemManager = {
  async getAll(options = {}) {
    await window.db.init();
    let items = await window.db.getAll('item_list');
    const categories = await window.db.getAll('category_list');
    const catMap = new Map(categories.map(c => [Number(c.id), c.name]));

    // Join category name
    items = items.map(item => ({
      ...item,
      category: catMap.get(Number(item.category_id)) || 'N/A'
    }));

    // Filter by user_id if specified
    if (options.userId) {
      items = items.filter(item => Number(item.user_id) === Number(options.userId));
    }

    // Filter by status if specified
    if (options.status !== undefined && options.status !== null && options.status !== '') {
      items = items.filter(item => Number(item.status) === Number(options.status));
    }

    // Filter by category if specified
    if (options.categoryId) {
      items = items.filter(item => Number(item.category_id) === Number(options.categoryId));
    }

    // Filter by search query if specified
    if (options.query) {
      const q = options.query.toLowerCase().trim();
      items = items.filter(item => 
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.fullname && item.fullname.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
      );
    }

    // Sort by created_at desc (or title asc if public list)
    if (options.sortByTitle) {
      items.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else {
      items.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    return items;
  },

  async getById(id) {
    await window.db.init();
    const item = await window.db.getById('item_list', id);
    if (!item) return null;
    const cat = await window.db.getById('category_list', item.category_id);
    return {
      ...item,
      category: cat ? cat.name : 'N/A'
    };
  },

  async save(data) {
    await window.db.init();
    const isPublicFounder = data.founder !== undefined;

    // Handle multiple photos or single image
    let images = [];
    if (Array.isArray(data.images) && data.images.length > 0) {
      images = data.images;
    } else if (data.image_path) {
      images = [data.image_path];
    }

    const primaryImage = images.length > 0 ? images[0] : (data.image_path || '');

    const record = {
      category_id: Number(data.category_id),
      item_type: data.item_type !== undefined ? Number(data.item_type) : 2,
      user_id: data.user_id ? Number(data.user_id) : null,
      fullname: data.fullname ? data.fullname.trim() : '',
      title: data.title ? data.title.trim() : '',
      brand: data.brand ? data.brand.trim() : '',
      color: data.color ? data.color.trim() : '',
      location: data.location ? data.location.trim() : '',
      item_date: data.item_date ? data.item_date.trim() : '',
      contact: data.contact ? data.contact.trim() : '',
      description: data.description ? data.description.trim() : '',
      identifying_details: data.identifying_details ? data.identifying_details.trim() : '',
      image_path: primaryImage,
      images: images,
      // If submitted by public founder, status is 0 (Pending review). Otherwise, take from data.status or default 0.
      status: isPublicFounder ? 0 : (data.status !== undefined ? Number(data.status) : 0),
      updated: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    if (data.id && Number(data.id) > 0) {
      record.id = Number(data.id);
      const original = await window.db.getById('item_list', record.id);
      record.created_at = original ? original.created_at : record.updated;
      if (!record.image_path && original && original.image_path) {
        record.image_path = original.image_path;
      }
      if ((!record.images || record.images.length === 0) && original && original.images) {
        record.images = original.images;
      }
      await window.db.put('item_list', record);
      return { 
        status: 'success', 
        iid: record.id, 
        msg: 'Item Data has been updated successfully.' 
      };
    } else {
      record.created_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newId = await window.db.add('item_list', record);
      const successMsg = isPublicFounder
        ? "Found Item report successfully submitted! Our team will review the details before publishing it to the public catalog."
        : "New Item Data has been saved successfully.";
      return { 
        status: 'success', 
        iid: newId, 
        msg: successMsg 
      };
    }
  },

  async getByUser(userId) {
    if (!userId) return [];
    return await this.getAll({ userId: Number(userId) });
  },

  async delete(id) {
    await window.db.init();
    await window.db.delete('item_list', id);
    return { status: 'success', msg: 'Item Data successfully deleted.' };
  },

  async updateStatus(id, newStatus) {
    await window.db.init();
    const item = await window.db.getById('item_list', id);
    if (!item) return { status: 'failed', msg: 'Item not found.' };
    item.status = Number(newStatus);
    item.updated = new Date().toISOString().replace('T', ' ').substring(0, 19);
    await window.db.put('item_list', item);
    return { status: 'success', msg: 'Item status updated successfully.' };
  }
};

if (typeof window !== 'undefined') {
  window.ItemManager = ItemManager;
}

