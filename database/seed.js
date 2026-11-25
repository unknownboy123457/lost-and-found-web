// Initial seed data identical to lfis_db.sql
const SEED_DATA = {
  categories: [
    {
      id: 1,
      name: 'Mobile Phones & Tablets',
      description: 'Smartphones, cellular devices, tablets, and e-readers recovered across campus facilities, stations, and public spaces.',
      status: 1,
      created_at: '2026-11-01 10:32:44',
      updated_at: null
    },
    {
      id: 2,
      name: 'Keys & Keychains',
      description: 'House keys, vehicle key fobs, office access cards, and distinctive keychains handed in to our security desks.',
      status: 1,
      created_at: '2026-11-01 10:34:27',
      updated_at: null
    },
    {
      id: 3,
      name: 'Watches & Jewelry',
      description: 'Wristwatches, smart bands, rings, necklaces, and jewelry items discovered in recreational and study areas.',
      status: 1,
      created_at: '2026-11-01 10:35:58',
      updated_at: '2026-11-01 10:36:15'
    },
    {
      id: 4,
      name: 'Bags & Backpacks',
      description: 'School bags, laptop backpacks, luggage, gym duffels, and tote bags found unattended in halls and terminals.',
      status: 1,
      created_at: '2026-11-01 11:00:00',
      updated_at: null
    },
    {
      id: 5,
      name: 'Wallets & IDs',
      description: 'Wallets, purses, government photo IDs, student cards, and credit card pouches kept in secure administrative hold.',
      status: 1,
      created_at: '2026-11-01 11:15:00',
      updated_at: null
    }
  ],

  items: [
    {
      id: 1,
      category_id: 2,
      user_id: null,
      fullname: 'Officer Mark Cooper',
      title: 'Found Keys with Navy Carabiner',
      location: 'Central Park North Track near 72nd Street',
      item_date: '2026-11-20',
      description: 'Set of 3 house keys attached to a navy blue metallic carabiner clip with a small silver bottle opener. Found on the running path bench.',
      contact: '09123564789',
      image_path: 'uploads/items/1.png',
      images: ['uploads/items/1.png'],
      status: 1,
      created_at: '2026-11-20 11:48:45',
      updated: '2026-11-20 11:48:45'
    },
    {
      id: 3,
      category_id: 1,
      user_id: null,
      fullname: 'Claire Blake',
      title: 'Found Android Smartphone in Parking Lot',
      location: 'Campus West Parking Lot Section B',
      item_date: '2026-11-22',
      description: 'Black Android smartphone with a dark textured protective case discovered on the asphalt near parking bay 42.',
      contact: '09123654897',
      image_path: 'uploads/items/3.png',
      images: ['uploads/items/3.png'],
      status: 1,
      created_at: '2026-11-22 12:55:48',
      updated: '2026-11-22 12:55:49'
    },
    {
      id: 5,
      category_id: 3,
      user_id: null,
      fullname: 'Samantha Lou',
      title: 'Classic Analog Wristwatch in Room 101',
      location: 'Main Science Building Lecture Hall 101',
      item_date: '2026-11-23',
      description: 'Stainless steel analog wristwatch with genuine dark brown leather strap left on a study desk after afternoon lectures.',
      contact: '09457778988',
      image_path: 'uploads/items/5.png',
      images: ['uploads/items/5.png'],
      status: 1,
      created_at: '2026-11-23 13:03:47',
      updated: '2026-11-23 13:03:47'
    },
    {
      id: 6,
      category_id: 5,
      user_id: null,
      fullname: 'Security Staff Wilson',
      title: 'Brown Leather Bifold Wallet',
      location: 'Grand Concourse Ticket Hall',
      item_date: '2026-11-18',
      description: 'Dark brown leather wallet with contrast stitching recovered near the ticket counter. Kept securely in the station safe.',
      contact: '09123564789',
      image_path: '',
      images: [],
      status: 2,
      created_at: '2026-11-18 13:34:29',
      updated: '2026-11-24 14:04:10'
    }
  ],

  inquiries: [
    {
      id: 1,
      fullname: 'Jane Doe',
      contact: '09123546788',
      email: 'jdoe@mail.com',
      message: 'Hello, I lost my blue umbrella in the library cafeteria yesterday. Did anyone turn it in?',
      status: 1,
      created_at: '2026-11-24 14:11:19',
      updated_at: '2026-11-24 14:25:47'
    }
  ],

  users: [
    {
      id: 1,
      firstname: 'Administrator',
      middlename: '',
      lastname: 'Admin',
      username: 'admin',
      email: 'admin@lostandfound.com',
      // SHA-256 for 'admin123'
      password_hash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
      avatar: 'uploads/avatars/1.png',
      type: 1,
      date_added: '2026-01-20 14:02:37',
      date_updated: '2026-11-25 10:00:00'
    },
    {
      id: 2,
      firstname: 'Claire',
      middlename: '',
      lastname: 'Blake',
      username: 'cblake',
      email: 'claire.blake@lostandfound.com',
      // SHA-256 for 'password123'
      password_hash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
      avatar: 'uploads/avatars/2.png',
      type: 2,
      date_added: '2026-04-26 15:54:27',
      date_updated: '2026-11-25 10:00:00'
    }
  ],

  system_info: [
    { meta_field: 'name', meta_value: 'Lost and Found Information System' },
    { meta_field: 'short_name', meta_value: 'LFIS' },
    { meta_field: 'logo', meta_value: 'uploads/logo.png' },
    { meta_field: 'user_avatar', meta_value: 'uploads/user_avatar.jpg' },
    { meta_field: 'cover', meta_value: 'uploads/cover.png' },
    { meta_field: 'phone', meta_value: '903-436-9356' },
    { meta_field: 'mobile', meta_value: '0917-351-8047' },
    { meta_field: 'email', meta_value: 'support@lostandfound.local' },
    { meta_field: 'address', meta_value: 'Central Lost & Found Office, Arlington, Texas, 76011' },
    {
      meta_field: 'welcome',
      meta_value: `<h1 style="text-align: center;">Welcome to the Official Lost and Found Hub</h1>
<p class="lead text-center mt-3">Connecting individuals with lost property through verified community reporting and secure administrative handovers.</p>
<p class="text-center text-muted">Browse our live catalog to search for recently discovered belongings, or sign in to submit a found item report. To prevent fraudulent claims, claimants must provide unique identifying proof before receiving collection clearance.</p>`
    },
    {
      meta_field: 'about',
      meta_value: `<h1 style="text-align: center;">About Our Lost & Found Network</h1>
<p class="lead text-center mt-3">We provide a centralized, secure platform to catalog, safeguard, and return lost property effectively.</p>
<p>Every year, thousands of valuable personal items are misplaced in public venues, campuses, and transit stations. Our system offers an organized digital registry where finders can report discovered items and rightful owners can reclaim them safely.</p>
<p>To uphold the highest level of community trust, our team requires unique identifying details that only the true owner would know before authorizing an item handover at our official collection points.</p>`
    },
    {
      meta_field: 'banner_images',
      meta_value: JSON.stringify(['uploads/banner/lf-wp-1.jpg', 'uploads/banner/lf-wp-2.jpg'])
    }
  ],

  cms_sections: [
    {
      id: 1,
      section_key: 'hero',
      title: 'Lost something? Get it back fast!',
      subtitle: 'We help you reconnect with your lost items easily through smart matching and verified community recovery.',
      content: 'Browse through verified lost and found listings or submit a detailed report in seconds.',
      image_path: 'uploads/cms/hero_bg.jpg',
      extra_data: JSON.stringify({
        reclaim_btn_text: 'Reclaim Your Item',
        reclaim_btn_link: './?page=items',
        found_btn_text: 'I Found Something',
        found_btn_link: './?page=found',
        how_btn_text: 'How It Works',
        show_search: true,
        has_embedded_text: true,
        overlay_opacity: 0,
        image_width: 1024,
        image_height: 697,
        aspect_ratio: '1.47:1',
        search_placeholder: 'Search by keyword, item title or brand...',
        location_placeholder: 'City, airport, station or campus...'
      }),
      is_active: 1,
      display_order: 1
    },
    {
      id: 2,
      section_key: 'partners',
      title: 'Trusted by these companies',
      subtitle: 'Used by the world\'s leading teams & startups',
      content: null,
      image_path: null,
      extra_data: JSON.stringify({ badge: '', speed: 25, grayscale: true }),
      is_active: 1,
      display_order: 2
    },
    {
      id: 3,
      section_key: 'how_it_works',
      title: 'How It Works',
      subtitle: 'Reuniting belongings safely in three easy and verified steps',
      content: null,
      image_path: null,
      extra_data: JSON.stringify({
        steps: [
          { step: 1, title: 'Report or Search', desc: 'Finders register found items with precise details. Owners quickly search our categorized live catalog.', icon: 'bi-search' },
          { step: 2, title: 'Smart Verification', desc: 'Claimants provide unique identifying characteristics and proof of ownership to ensure total integrity.', icon: 'bi-shield-check' },
          { step: 3, title: 'Safe Return & Delivery', desc: 'Coordinate secure venue pickup or scheduled courier handover backed by admin confirmation.', icon: 'bi-box-seam' }
        ]
      }),
      is_active: 1,
      display_order: 3
    },
    {
      id: 4,
      section_key: 'testimonials',
      title: 'Our clients feedback',
      subtitle: 'We provide all the advantage that can simplify all your financial and banking support without any further issues',
      content: null,
      image_path: null,
      extra_data: JSON.stringify({ badge: '' }),
      is_active: 1,
      display_order: 4
    },
    {
      id: 5,
      section_key: 'stats',
      title: 'Live Recovery Impact',
      subtitle: 'Real-time metrics demonstrating community trust and rapid reunification.',
      content: null,
      image_path: null,
      extra_data: JSON.stringify({
        counters: [
          { label: 'Items Reunited', value: '15,000+', icon: 'bi-award' },
          { label: 'Claim Accuracy', value: '98.4%', icon: 'bi-patch-check' },
          { label: 'Verified Venues', value: '450+', icon: 'bi-building' },
          { label: 'Average Recovery', value: '< 48 hrs', icon: 'bi-clock-history' }
        ]
      }),
      is_active: 1,
      display_order: 5
    },
    {
      id: 6,
      section_key: 'trust',
      title: 'Enterprise Security & Community Trust',
      subtitle: 'Built from the ground up with data confidentiality and fraud prevention safeguards.',
      content: null,
      image_path: null,
      extra_data: JSON.stringify({
        badges: [
          { title: '100% Local Data Privacy', desc: 'All sensitive claimant credentials and identifying details remain encrypted locally.', icon: 'bi-lock' },
          { title: 'Proof Verification', desc: 'Unique secret item marks protect owners from fraudulent claims.', icon: 'bi-person-check' },
          { title: 'Verified Venue Network', desc: 'Integrated directly with partner transport desks, university campuses, and event centers.', icon: 'bi-geo-alt' }
        ]
      }),
      is_active: 1,
      display_order: 6
    },
    {
      id: 7,
      section_key: 'footer',
      title: 'Lost and Found Information System',
      subtitle: 'Connecting people, places, and lost belongings with integrity and intelligence.',
      content: null,
      image_path: null,
      extra_data: JSON.stringify({
        phone: '903-436-9356',
        email: 'support@lfis.local',
        address: '4226 Florence Street, Arlington, Texas, 76011',
        quick_links: [
          { label: 'Search Lost Items', url: './?page=items' },
          { label: 'Report Found Item', url: './?page=found' },
          { label: 'How It Works', url: '#how-it-works' },
          { label: 'About Us', url: './?page=about' },
          { label: 'Contact Support', url: './?page=contact' }
        ],
        legal_links: [
          { label: 'Privacy Policy', url: '#' },
          { label: 'Terms of Service', url: '#' },
          { label: 'Security Guidelines', url: '#' },
          { label: 'Community Rules', url: '#' }
        ]
      }),
      is_active: 1,
      display_order: 7
    },
    {
      id: 8,
      section_key: 'faq',
      title: 'Frequently Asked Questions',
      subtitle: 'Quick answers to common questions about finding and claiming your belongings.',
      content: null,
      image_path: null,
      extra_data: JSON.stringify({ floating_widget: true, button_text: 'Help & FAQs' }),
      is_active: 1,
      display_order: 8
    }
  ],

  cms_partners: [
    { id: 1, name: 'ARC', logo_path: 'uploads/cms/partners/arc.svg', website_url: 'https://arc.net', display_order: 1, is_active: 1 },
    { id: 2, name: 'Descript', logo_path: 'uploads/cms/partners/descript.svg', website_url: 'https://descript.com', display_order: 2, is_active: 1 },
    { id: 3, name: 'Mercury', logo_path: 'uploads/cms/partners/mercury.svg', website_url: 'https://mercury.com', display_order: 3, is_active: 1 },
    { id: 4, name: 'Ramp', logo_path: 'uploads/cms/partners/ramp.svg', website_url: 'https://ramp.com', display_order: 4, is_active: 1 },
    { id: 5, name: 'Retool', logo_path: 'uploads/cms/partners/retool.svg', website_url: 'https://retool.com', display_order: 5, is_active: 1 },
    { id: 6, name: 'Brex', logo_path: 'uploads/cms/partners/brex.svg', website_url: 'https://brex.com', display_order: 6, is_active: 1 },
    { id: 7, name: 'Perplexity', logo_path: 'uploads/cms/partners/perplexity.svg', website_url: 'https://perplexity.ai', display_order: 7, is_active: 1 },
    { id: 8, name: 'OpenAI', logo_path: 'uploads/cms/partners/openai.svg', website_url: 'https://openai.com', display_order: 8, is_active: 1 },
    { id: 9, name: 'Claude', logo_path: 'uploads/cms/partners/claude.svg', website_url: 'https://anthropic.com', display_order: 9, is_active: 1 }
  ],

  cms_testimonials: [
    {
      id: 1,
      author_name: 'Harsh P.',
      author_role: 'Product Designer',
      avatar_path: 'uploads/cms/testimonials/harsh.jpg',
      rating: 5,
      headline: 'You have right place',
      review_text: 'Pagedone has made it possible for me to stay on top of my portfolio and make informed decisions quickly and easily.',
      display_order: 1,
      is_active: 1
    },
    {
      id: 2,
      author_name: 'Jane D.',
      author_role: 'CEO',
      avatar_path: 'uploads/cms/testimonials/jane.jpg',
      rating: 5,
      headline: 'It\'s best',
      review_text: 'The customer service team at pagedone went above and beyond to help me resolve a billing issue.',
      display_order: 2,
      is_active: 1
    },
    {
      id: 3,
      author_name: 'Michael Chang',
      author_role: 'Campus Director',
      avatar_path: 'uploads/cms/testimonials/michael.jpg',
      rating: 5,
      headline: 'Seamless University Recovery',
      review_text: 'We integrated LFIS across our university campus buildings. Unclaimed items dropped by 70% and students love how fast they can search the catalog from their phones.',
      display_order: 3,
      is_active: 1
    },
    {
      id: 4,
      author_name: 'Sarah Jenkins',
      author_role: 'Airport Operations Manager',
      avatar_path: 'uploads/cms/testimonials/sarah.jpg',
      rating: 5,
      headline: 'Unmatched Verification Standard',
      review_text: 'Managing thousands of lost passenger items used to take days of paperwork. Now items are logged, photographed, and matched in minutes with zero fraud.',
      display_order: 4,
      is_active: 1
    }
  ],

  cms_faqs: [
    {
      id: 1,
      question: 'How do I claim an item listed on the platform?',
      answer: 'Click on the item card to view its public listing, then click "Claim This Item". You will be asked to sign in with your verified mobile number and provide proof of ownership (such as secret markings, serial numbers, or matching photos).',
      category: 'Claiming',
      display_order: 1,
      is_active: 1
    },
    {
      id: 2,
      question: 'What should I do if I find someone\'s lost property?',
      answer: 'Click "Post an Item" or "I Found Something". Fill in the category, approximate location, date, and general description. Never post secret serial numbers or passcodes in public descriptions so genuine owners can verify themselves.',
      category: 'Reporting',
      display_order: 2,
      is_active: 1
    },
    {
      id: 3,
      question: 'Is registration and mobile verification mandatory?',
      answer: 'Yes. To protect owners and prevent fraudulent claims or spam listings, mobile OTP verification is required to post items and submit claims.',
      category: 'Account',
      display_order: 3,
      is_active: 1
    },
    {
      id: 4,
      question: 'How does the physical handover or delivery work?',
      answer: 'Once an administrator verifies your ownership claim, you will receive an in-app notification with scheduled handover times and approved venue coordinates, or options for secure tracked delivery.',
      category: 'Handover',
      display_order: 4,
      is_active: 1
    },
    {
      id: 5,
      question: 'Is there any fee to recover my lost belongings?',
      answer: 'No! Standard reunification through authorized partner lost and found desks is completely free. Optional tracked courier delivery can be arranged if you are unable to pick up in person.',
      category: 'General',
      display_order: 5,
      is_active: 1
    }
  ]
};

if (typeof window !== 'undefined') {
  window.SEED_DATA = SEED_DATA;
}

