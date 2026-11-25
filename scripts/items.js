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

  async getById(id, caller = null) {
    await window.db.init();
    const item = await window.db.getById('item_list', id);
    if (!item) return null;
    const cat = await window.db.getById('category_list', item.category_id);
    const enriched = {
      ...item,
      category: cat ? cat.name : 'N/A'
    };

    // Determine authorization to view private collection details
    let isAdmin = false;
    let userId = null;
    if (caller === true) isAdmin = true;
    else if (typeof caller === 'object' && caller !== null) {
      isAdmin = Number(caller.type) === 1;
      userId = caller.id;
    } else if (typeof caller === 'number' || typeof caller === 'string') {
      userId = Number(caller);
      if (userId === 1) isAdmin = true;
    }

    if (!isAdmin && window.AuthManager) {
      if (window.AuthManager.isAdmin && window.AuthManager.isAdmin()) isAdmin = true;
      const logged = window.AuthManager.getCurrentUser ? window.AuthManager.getCurrentUser() : null;
      if (logged) {
        if (Number(logged.type) === 1) isAdmin = true;
        if (!userId) userId = logged.id;
      }
    }

    // Check if user is the founder
    const isFounder = userId && enriched.user_id && Number(enriched.user_id) === Number(userId);

    // Strict privacy: only admin or founder get raw private room details by default
    if (!isAdmin && !isFounder) {
      enriched.has_private_collection_info = Boolean(enriched.founder_hostel || enriched.founder_room);
      delete enriched.founder_hostel;
      delete enriched.founder_room;
      delete enriched.collection_instructions;
    }

    return enriched;
  },

  /**
   * Securely retrieve private college collection & room details.
   * Access is strictly restricted to:
   * 1. System Administrators
   * 2. The original Finder
   * 3. An approved claimant whose claim has been verified and approved by Admin.
   */
  async getCollectionDetails(itemId, caller = null) {
    await window.db.init();
    const rawItem = await window.db.getById('item_list', itemId);
    if (!rawItem) {
      return { status: 'failed', msg: 'Item not found in database.' };
    }

    let isAdmin = false;
    let userId = null;
    if (caller === true) isAdmin = true;
    else if (typeof caller === 'object' && caller !== null) {
      isAdmin = Number(caller.type) === 1;
      userId = caller.id;
    } else if (typeof caller === 'number' || typeof caller === 'string') {
      userId = Number(caller);
      if (userId === 1) isAdmin = true;
    }

    if (!isAdmin && window.AuthManager) {
      if (window.AuthManager.isAdmin && window.AuthManager.isAdmin()) isAdmin = true;
      const logged = window.AuthManager.getCurrentUser ? window.AuthManager.getCurrentUser() : null;
      if (logged) {
        if (Number(logged.type) === 1) isAdmin = true;
        if (!userId) userId = logged.id;
      }
    }

    // If Admin or the item's original finder, grant access
    const isFounder = userId && rawItem.user_id && Number(rawItem.user_id) === Number(userId);
    if (isAdmin || isFounder) {
      return {
        status: 'success',
        is_admin: isAdmin,
        is_founder: isFounder,
        collection_details: {
          founder_name: rawItem.fullname || 'Campus Member',
          founder_contact: rawItem.contact || 'Available upon request',
          founder_hostel: rawItem.founder_hostel || 'Campus Residential Block',
          founder_room: rawItem.founder_room || 'Room / Reception Desk',
          collection_instructions: rawItem.collection_instructions || 'Please coordinate with the founder during daytime campus hours.'
        }
      };
    }

    // If caller is an authenticated student, check if they have an APPROVED claim
    if (!userId) {
      return { status: 'forbidden', msg: 'Authentication required. Please log in to view collection details.' };
    }

    const allClaims = await window.db.getAll('claims');
    const userClaim = allClaims.find(c => 
      Number(c.item_id) === Number(itemId) && 
      Number(c.claimant_id) === Number(userId)
    );

    if (!userClaim) {
      return { status: 'forbidden', msg: 'No ownership claim on record for this item.' };
    }

    const approvedStatuses = ['approved', 'approved_for_collection', 'ready_for_scheduling', 'scheduled', 'completed', 'returned'];
    if (!approvedStatuses.includes(userClaim.status)) {
      return {
        status: 'forbidden',
        claim_status: userClaim.status,
        msg: 'Collection details are locked. An administrator must verify and approve your ownership answers before collection details are unlocked.'
      };
    }

    // Claimant is verified & approved! Return the private room & contact information
    return {
      status: 'success',
      claim_id: userClaim.id,
      claim_status: userClaim.status,
      collection_details: {
        founder_name: rawItem.fullname || 'Campus Member',
        founder_contact: rawItem.contact || 'Available upon request',
        founder_hostel: rawItem.founder_hostel || 'Hostel / Building not specified',
        founder_room: rawItem.founder_room || 'Room not specified',
        collection_instructions: rawItem.collection_instructions || 'Please coordinate with the finder to collect your belonging.'
      }
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
      
      // College Private Handover & Room Details (Protected from public listing)
      founder_hostel: data.founder_hostel ? data.founder_hostel.trim() : (data.hostel ? data.hostel.trim() : ''),
      founder_room: data.founder_room ? data.founder_room.trim() : (data.room ? data.room.trim() : ''),
      collection_instructions: data.collection_instructions ? data.collection_instructions.trim() : '',

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

