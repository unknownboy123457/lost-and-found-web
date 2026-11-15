// Initial seed data identical to lfis_db.sql
const SEED_DATA = {
  categories: [
    {
      id: 1,
      name: 'Mobile Phones',
      description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id est enim. Fusce malesuada dapibus lobortis. Maecenas commodo cursus ante, a efficitur lorem ultrices a. Cras tincidunt, leo at consequat viverra, lacus elit tempus diam, sed scelerisque turpis purus eu ex. Sed placerat, sem vel accumsan maximus, nibh massa rhoncus mi, quis lacinia nisl quam eu purus.</p>',
      status: 1,
      created_at: '2023-05-01 10:32:44',
      updated_at: null
    },
    {
      id: 2,
      name: 'Keys',
      description: '<p>Nulla at tellus tristique, venenatis mauris a, commodo urna. Integer arcu quam, maximus id nulla vitae, eleifend lacinia tellus. Proin nec consequat risus. Sed et felis justo. Duis quis magna vel felis volutpat consectetur ut et enim. Integer nec auctor felis. Fusce nec mauris luctus, lacinia erat in, porttitor tellus. Nunc quis mauris velit. Sed nec libero vitae leo blandit mattis.</p>',
      status: 1,
      created_at: '2023-05-01 10:34:27',
      updated_at: null
    },
    {
      id: 3,
      name: 'Watches',
      description: '<p>Etiam volutpat dictum tempor. Nulla rutrum arcu eu volutpat pharetra. Aliquam non luctus ex. Maecenas nibh ipsum, efficitur in dui at, rhoncus convallis orci. Duis bibendum tempor sapien, non sollicitudin massa porttitor sed.</p>',
      status: 1,
      created_at: '2023-05-01 10:35:58',
      updated_at: '2023-05-01 10:36:15'
    }
  ],

  items: [
    {
      id: 1,
      category_id: 2,
      fullname: 'Mark Cooper',
      title: 'Found Keys at Central Park',
      description: 'Suspendisse nisl diam, pretium ut placerat nec, pellentesque in tortor. Suspendisse vitae arcu a mi dapibus elementum ac dignissim tellus. Duis vitae molestie lacus, porttitor lacinia justo. Ut vulputate, ipsum interdum consequat mollis, odio nisl vulputate est, quis ornare nisi massa a odio.',
      contact: '09123564789',
      image_path: 'uploads/items/1.png',
      status: 1,
      created_at: '2023-05-01 11:48:45',
      updated: '2023-05-01 11:48:45'
    },
    {
      id: 3,
      category_id: 1,
      fullname: 'Claire Blake',
      title: 'Found an Android Phone @ Restaurant Parking Lot',
      description: 'Etiam accumsan quis augue a pulvinar. Etiam pretium sodales ipsum, cursus venenatis urna fringilla vel. Nunc fringilla non magna sit amet pharetra. Nam iaculis rutrum eleifend. Mauris rutrum, urna eget rhoncus consequat, purus mauris luctus orci, at venenatis ex elit sed risus.',
      contact: '09123654897',
      image_path: 'uploads/items/3.png',
      status: 1,
      created_at: '2023-05-01 12:55:48',
      updated: '2023-05-01 12:55:49'
    },
    {
      id: 5,
      category_id: 3,
      fullname: 'Samantha Lou',
      title: 'Found a Watch left @ Room 101',
      description: 'Sed ultricies turpis eget commodo condimentum. Nam ac lorem vitae nulla fringilla imperdiet sit amet a arcu. Maecenas malesuada felis eleifend condimentum porttitor. Cras sed metus nec nibh interdum bibendum sit amet at sem.',
      contact: '09457778988',
      image_path: 'uploads/items/5.png',
      status: 1,
      created_at: '2023-05-01 13:03:47',
      updated: '2023-05-01 13:03:47'
    },
    {
      id: 6,
      category_id: 1,
      fullname: 'Wilson Smith',
      title: 'Found Something @ The Mall',
      description: 'Donec metus sem, volutpat id mi in, fringilla aliquet odio. Donec eleifend sem et ex maximus tristique. Donec porttitor venenatis aliquet. Aliquam tristique est sed nulla fermentum aliquam eget sed ex',
      contact: '09123564789',
      image_path: '',
      status: 2,
      created_at: '2023-05-01 13:34:29',
      updated: '2023-05-01 14:04:10'
    }
  ],

  inquiries: [
    {
      id: 1,
      fullname: 'Jane Doe',
      contact: '09123546788',
      email: 'jdoe@mail.com',
      message: 'Vestibulum suscipit felis at magna congue gravida. Quisque interdum eu odio sed vulputate.',
      status: 1,
      created_at: '2023-05-01 14:11:19',
      updated_at: '2023-05-01 14:25:47'
    }
  ],

  users: [
    {
      id: 1,
      firstname: 'Adminstrator',
      middlename: '',
      lastname: 'Admin',
      username: 'admin',
      // SHA-256 for 'admin123'
      password_hash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
      avatar: 'uploads/avatars/1.png',
      type: 1,
      date_added: '2021-01-20 14:02:37',
      date_updated: '2023-04-26 16:01:02'
    },
    {
      id: 2,
      firstname: 'Claire',
      middlename: '',
      lastname: 'Blake',
      username: 'cblake',
      // SHA-256 for 'password123'
      password_hash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
      avatar: 'uploads/avatars/2.png',
      type: 2,
      date_added: '2023-04-26 15:54:27',
      date_updated: '2023-04-26 16:02:36'
    }
  ],

  system_info: [
    { meta_field: 'name', meta_value: 'Lost and Found Information System' },
    { meta_field: 'short_name', meta_value: 'PHP - LFIS' },
    { meta_field: 'logo', meta_value: 'uploads/logo.png' },
    { meta_field: 'user_avatar', meta_value: 'uploads/user_avatar.jpg' },
    { meta_field: 'cover', meta_value: 'uploads/cover.png' },
    { meta_field: 'phone', meta_value: '903-436-9356' },
    { meta_field: 'mobile', meta_value: '0917-351-8047' },
    { meta_field: 'email', meta_value: 'info@simpleorganization.org' },
    { meta_field: 'address', meta_value: '4226 Florence Street, Arlington, Texas, 76011' },
    {
      meta_field: 'welcome',
      meta_value: `<h1 style="text-align: center;">Home Page</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mattis purus accumsan mattis interdum. Integer elementum quam sapien, nec egestas lorem rhoncus sit amet. Suspendisse quis blandit augue. Fusce eget lacus euismod eros eleifend elementum. Suspendisse vulputate pretium sapien, in fringilla lacus feugiat quis. Vivamus non vulputate leo, quis fermentum felis. Vivamus pharetra risus sagittis tortor bibendum, id dictum odio tristique. Aenean non malesuada mauris. Praesent nisi turpis, molestie sed cursus ut, consequat ac sapien. Phasellus euismod magna justo, eu blandit nunc condimentum nec. Vivamus hendrerit, nunc eu bibendum tempus, urna turpis ornare neque, vel lobortis est mi non lectus. Nulla dictum mi vel ligula posuere feugiat.</p>
<p>Proin vulputate sapien sed purus eleifend rhoncus. Mauris dapibus ex id mi vestibulum eleifend. Ut pretium elit sed ex maximus, at dictum purus tristique. Suspendisse eu urna ex. In placerat enim quam, porttitor bibendum augue consequat ultricies. Phasellus vel lacus lacinia, dignissim quam in, porttitor risus. Pellentesque commodo neque a metus vulputate, a rhoncus magna blandit. Donec congue nunc quis vulputate convallis. Nullam enim enim, porta ut euismod a, mollis vel augue. Cras metus quam, maximus at sollicitudin et, laoreet at lacus. Integer vel mattis eros, id hendrerit nulla. Maecenas vitae sollicitudin urna, in mattis risus. Morbi eleifend, augue non mollis dictum, lacus felis hendrerit dui, ac eleifend tortor massa in elit.</p>
<p>Sed nisi diam, feugiat ut leo vel, eleifend tempor nunc. Etiam ut magna porta, malesuada nunc sed, dignissim nisi. Quisque sed est vitae elit pulvinar finibus in a massa. Mauris ullamcorper mattis mi, id pulvinar tellus. Maecenas dignissim purus vitae tortor efficitur dictum. Fusce ac imperdiet quam. Vivamus nulla eros, fermentum eu sapien quis, cursus faucibus erat. Nunc placerat augue eu viverra iaculis. Nunc nec lorem a elit tristique porta non in odio. Donec vel porta nulla. In varius quam vitae dui consectetur consequat. Cras egestas metus at libero sodales facilisis. Proin ac ipsum nec enim bibendum accumsan. Proin faucibus blandit justo. Donec dapibus hendrerit massa, vel congue velit ornare ac. Phasellus tincidunt finibus hendrerit.</p>
<p>Aenean nisi urna, tincidunt eu blandit egestas, ornare in ipsum. Aenean vulputate eros eu turpis lobortis, a facilisis mauris placerat. Aenean libero nibh, molestie vitae ligula sed, rhoncus dapibus augue. Curabitur malesuada aliquet semper. Sed a eros libero. Cras faucibus id libero ut bibendum. Praesent et purus urna. Etiam lectus leo, ornare at imperdiet sit amet, rhoncus cursus odio. Vestibulum facilisis lorem at ultricies fringilla. Duis quis feugiat ex. Fusce efficitur vulputate lorem, quis malesuada leo porttitor a. Curabitur quis sapien molestie, consequat neque nec, vestibulum mauris.</p>`
    },
    {
      meta_field: 'about',
      meta_value: `<h1 style="text-align: center;">About Us</h1>
<p>Phasellus tempus ante tristique laoreet imperdiet. Nam fermentum sapien a leo consectetur ultricies. Etiam nec ultrices lectus, aliquam scelerisque lectus. Quisque tristique euismod rutrum. Nam scelerisque commodo nibh, ut finibus velit pulvinar at. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse interdum neque sit amet interdum venenatis. Nunc ut dolor sapien. Nunc rutrum imperdiet venenatis. Morbi vehicula lacus vel purus pretium molestie vel iaculis ante. Integer dignissim congue fringilla. Cras non tempor urna. Cras et magna quis ipsum sollicitudin maximus a a lorem. Aliquam blandit lobortis metus eu volutpat.</p>
<p>Nullam ut viverra velit. Phasellus felis massa, mattis sed lacus id, aliquam venenatis quam. Mauris vulputate orci ac lectus hendrerit, tincidunt aliquam nunc egestas. Pellentesque tempor consequat aliquet. Duis porttitor imperdiet feugiat. Sed a odio at nisi molestie congue. Aenean accumsan eleifend porta. Donec tempus rhoncus mi, vel gravida neque pretium non. Pellentesque mattis massa vel varius placerat. Mauris nisl velit, eleifend dignissim velit vitae, ullamcorper mattis magna. Aenean auctor nisi sed libero commodo rhoncus. Curabitur libero ante, vulputate vel nisi a, finibus sagittis mi. Vestibulum sollicitudin, eros quis bibendum dapibus, sapien sem eleifend mi, sit amet pellentesque libero risus a nunc. Aliquam non rutrum nisi. Donec feugiat dui quis semper condimentum.</p>
<p>Vestibulum tristique a ligula vitae posuere. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Ut malesuada, elit vel porttitor feugiat, sapien sem pharetra urna, nec tempus enim tortor eu lorem. Curabitur pulvinar quam eu metus pretium, ut consequat ligula placerat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras facilisis est nec diam tristique tempor. Cras id augue vestibulum velit commodo tristique.</p>`
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

