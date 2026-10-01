// Products and Services Database for Rahisa Mehendi Art (@rahisa_mhendi_art)

const MEHENDI_PRODUCTS = [
  {
    id: 'prod-powder',
    name: '100% Pure Organic Mehendi Powder',
    category: 'powder',
    badge: 'Bestseller',
    image: 'assets/images/cones.jpg',
    description: 'Triple-cloth-sifted, micro-fine Lawsonia Inermis powder sourced directly from the fertile henna farms of Sojat, Rajasthan. Produces an ultra-smooth, stringy, clump-free paste with guaranteed dark Lawsone dye release.',
    rating: 4.9,
    reviewsCount: 428,
    selectedVariantIndex: 0,
    variants: [
      { name: '500g Pack', weight: '500g Pouch', price: 150, originalPrice: 200, inStock: true },
      { name: '1 kg Pack', weight: '1 kg Pouch', price: 300, originalPrice: 400, inStock: true }
    ],
    features: [
      '100% Pure Sojat Lawsonia Inermis leaf powder',
      'Triple-cloth-sifted micro-fine silk grade',
      'Zero chemicals, zero preservatives, 100% PPD-free',
      'High natural dye content (>3.2% Lawsone)',
      'Moisture-lock vacuum sealed metallic foil pouch'
    ]
  },
  {
    id: 'prod-oil-eucalyptus',
    name: 'Eucalyptus Mehendi Oil (100ml)',
    category: 'oils',
    badge: 'High Cineol',
    image: 'assets/images/cones.jpg',
    description: 'Pure, steam-distilled eucalyptus globulus essential oil boasting exceptionally high natural cineol terpenes. Penetrates deep into skin layers to oxidize Lawsone into a rich, long-lasting deep burgundy-black stain.',
    rating: 4.9,
    reviewsCount: 215,
    selectedVariantIndex: 0,
    variants: [
      { name: '100ml Bottle', weight: '100ml Glass Bottle', price: 350, originalPrice: 450, inStock: true }
    ],
    features: [
      '100% Pure steam-distilled Eucalyptus Globulus',
      'Highest natural cineol terpene concentration',
      'Deep burgundy-black stain enhancer',
      'Amber UV-protective glass bottle with dropper cap',
      'Therapeutic invigorating botanical fragrance'
    ]
  },
  {
    id: 'prod-oil-teatree',
    name: 'Tea Tree Mehendi Oil (100ml)',
    category: 'oils',
    badge: 'Gentle & Dark',
    image: 'assets/images/cones.jpg',
    description: 'Therapeutic grade Australian Melaleuca Alternifolia oil specially formulated for mehendi artists. Rich in Terpinen-4-ol for intensive dark stains while being exceptionally soothing and gentle on sensitive skin.',
    rating: 4.8,
    reviewsCount: 178,
    selectedVariantIndex: 0,
    variants: [
      { name: '100ml Bottle', weight: '100ml Glass Bottle', price: 350, originalPrice: 450, inStock: true }
    ],
    features: [
      '100% Pure Australian Melaleuca Alternifolia',
      'High Terpinen-4-ol catalyst for deep color release',
      'Extra gentle formulation suitable for sensitive skin & brides',
      'Naturally antibacterial and anti-fungal skin barrier',
      'Aroma-balanced for prolonged bridal sessions'
    ]
  },
  {
    id: 'prod-oil-cajuput',
    name: 'Cajuput Mehendi Oil (100ml)',
    category: 'oils',
    badge: 'Artist Choice',
    image: 'assets/images/cones.jpg',
    description: 'Premium Indonesian Melaleuca Cajuputi oil rich in Cineol terpenes. Acclaimed by professional bridal mehendi artists worldwide for delivering the fastest color oxidation and deepest mahogany undertones.',
    rating: 5.0,
    reviewsCount: 264,
    selectedVariantIndex: 0,
    variants: [
      { name: '100ml Bottle', weight: '100ml Glass Bottle', price: 350, originalPrice: 450, inStock: true }
    ],
    features: [
      'Authentic Indonesian Grade-A Melaleuca Cajuputi',
      'Fastest natural Lawsone oxidation catalyst',
      'Blends effortlessly into henna paste for smooth flow',
      'Preferred by top bridal henna artists worldwide',
      'Guarantees deep mahogany-brownish stain'
    ]
  },
  {
    id: 'prod-cones',
    name: 'Ready-to-Use Organic Henna Cones',
    category: 'cones',
    badge: 'Freshly Rolled',
    image: 'assets/images/cones.jpg',
    description: 'Freshly hand-rolled organic bridal henna cones made weekly with pure Sojat powder, therapeutic essential oils, and black tea brew. Fitted with precision 0.38mm tips for silky, flawless micro-line work.',
    rating: 5.0,
    reviewsCount: 610,
    selectedVariantIndex: 0,
    variants: [
      { name: 'Pack of 6 Cones', weight: '6 Cones (30g each)', price: 180, originalPrice: 240, inStock: true },
      { name: 'Pack of 12 Cones', weight: '12 Cones (30g each)', price: 320, originalPrice: 420, inStock: true }
    ],
    features: [
      'Ultra-fine 0.38mm smooth acrylic tip',
      'Freshly handmade in small batches weekly',
      'Zero chemicals, zero synthetic dyes, 100% skin safe',
      'Stains deep mahogany-burgundy within 48 hours',
      'Can be frozen up to 6 months for future use'
    ]
  },
  {
    id: 'prod-balm',
    name: 'Natural Henna Aftercare Balm & Sealant',
    category: 'aftercare',
    badge: 'Stain Lock',
    image: 'assets/images/cones.jpg',
    description: 'Ayurvedic darkening balm handcrafted with natural beeswax, virgin coconut butter, clove bud oil, and eucalyptus. Creates an impermeable moisture barrier to protect fresh henna from water while intensifying stain depth.',
    rating: 4.8,
    reviewsCount: 195,
    selectedVariantIndex: 0,
    variants: [
      { name: '50g Tin', weight: '50g Travel Tin', price: 220, originalPrice: 290, inStock: true },
      { name: '100g Jar', weight: '100g Glass Jar', price: 390, originalPrice: 500, inStock: true }
    ],
    features: [
      '100% natural beeswax and cold-pressed botanical oils',
      'Infused with warming clove & eucalyptus extracts',
      'Forms a water-resistant protective seal over skin',
      'Extends henna stain lifespan to 12 - 16 days',
      'Non-greasy, pleasant herbal floral fragrance'
    ]
  },
  {
    id: 'prod-diy-kit',
    name: 'Complete DIY Bridal & Festival Henna Kit',
    category: 'kits',
    badge: 'All-In-One Box',
    image: 'assets/images/craft.jpg',
    description: 'Deluxe all-inclusive henna kit containing 6 fresh organic cones, 1 bottle of 100ml Eucalyptus Mehendi Oil, 1 Aftercare Balm, 2 reusable intricate stencils, and an application tutorial booklet.',
    rating: 4.9,
    reviewsCount: 142,
    selectedVariantIndex: 0,
    variants: [
      { name: 'Complete Box Set', weight: 'Full Gift Box', price: 999, originalPrice: 1399, inStock: true }
    ],
    features: [
      '6 Fresh Organic Cones (0.38mm tips)',
      '1 Eucalyptus Mehendi Oil (100ml)',
      '1 Natural Aftercare Balm (50g)',
      '2 Reusable Self-Adhesive Henna Stencils',
      'Packed in luxury golden gift packaging'
    ]
  },
  {
    id: 'prod-practice-hand',
    name: 'Double-Sided Acrylic Henna Practice Hand',
    category: 'practice',
    badge: 'For Learners',
    image: 'assets/images/craft.jpg',
    description: 'High-gloss, anatomical female hand template for henna artists and students to practice intricate mandalas, Arabic vines, and bridal figures. Reusable and instantly washable with warm water.',
    rating: 4.7,
    reviewsCount: 88,
    selectedVariantIndex: 0,
    variants: [
      { name: 'Standard Life-Size Hand', weight: 'Front & Back Dual Sided', price: 499, originalPrice: 650, inStock: true }
    ],
    features: [
      'Life-sized anatomical female hand and forearm template',
      'Front palm and back hand dual-sided practice surface',
      'Smooth acrylic finish for true cone gliding feel',
      '100% washable and reusable endlessly'
    ]
  }
];

// Henna service packages for booking (Bridal starts at ₹5,000)
const MEHENDI_SERVICES = [
  {
    id: 'srv-bridal-classic',
    title: 'Bridal Mehendi (Signature)',
    category: 'Bridal',
    duration: '4 - 5 Hours',
    price: '₹5,000',
    basePrice: 5000,
    rating: '5.0 (280+ Brides)',
    badge: 'Starts at ₹5,000',
    image: 'assets/images/hero.jpg',
    description: 'Exquisite bridal mehendi featuring customized bride & groom elements, traditional peacocks, intricate floral mandalas, check jali work reaching up to mid-forearms, and matching bridal feet pattern.',
    included: [
      'Both Hands (Front & Back) up to mid-forearms',
      'Both Feet up to ankles included',
      'Bride & Groom names/wedding hashtags woven in',
      'Complimentary 2 Fresh Organic Touch-Up Cones',
      'Herbal Eucalyptus aftercare balm application'
    ]
  },
  {
    id: 'srv-bridal-royal',
    title: 'Royal Heritage Bridal Mehendi',
    category: 'Bridal',
    duration: '6 - 8 Hours',
    price: '₹8,500',
    basePrice: 8500,
    rating: '5.0 (210+ Brides)',
    badge: 'Luxury Masterpiece',
    image: 'assets/images/mandala.jpg',
    description: 'Our most lavish haute couture bridal package. Features full Radha-Krishna portraits or Doli-Baraat processions, custom love story milestones, dense micro-lines up to elbows, and full bridal legs/feet.',
    included: [
      'Both Hands (Front & Back) reaching elbows',
      'Both Feet & Ankles reaching mid-calf',
      'Hyper-detailed portrait figures & royal jali',
      'Complimentary Deluxe Aftercare Gift Kit',
      'Post-application lemon-sugar mist & clove smoke treatment'
    ]
  },
  {
    id: 'srv-engagement',
    title: 'Engagement & Roka Henna',
    category: 'Engagement',
    duration: '2.5 - 3 Hours',
    price: '₹3,500',
    basePrice: 3500,
    rating: '4.9 (135+ Clients)',
    badge: 'Trending',
    image: 'assets/images/arabic.jpg',
    description: 'Elegant, modern Indo-Western and Gulf Arabic floral designs tailored for engagement ceremonies, ring ceremonies, and Roka celebrations. Balanced negative space with eye-catching bold borders.',
    included: [
      'Both Hands (Front & Back) stylish flow up to wrists/forearms',
      'Intricate ring-finger accent framing the engagement ring',
      'Fine shaded petals, Moroccan grids, and hanging lace chains',
      'Fresh 100% organic cones used'
    ]
  },
  {
    id: 'srv-guest-party',
    title: 'Guest & Party Mehendi (Sangeet)',
    category: 'Guest/Party Mehendi',
    duration: '3 Hours minimum',
    price: '₹2,500',
    basePrice: 2500,
    rating: '4.8 (95+ Events)',
    badge: 'Group Celebration',
    image: 'assets/images/applying.jpg',
    description: 'Dedicated professional artists for Sangeet nights, Mehendi parties, and family gatherings. Base package covers up to 10 elegant guest palms with rapid, beautiful Arabic or mandala designs.',
    included: [
      '1 to 2 skilled artists on-site',
      'Covers up to 10 guest palms (additional palms at ₹200 each)',
      'Fast Arabic vines, mandalas, and wrist cuffs',
      'All organic henna cones provided'
    ]
  },
  {
    id: 'srv-festive',
    title: 'Festive Henna (Karwa Chauth / Eid / Diwali)',
    category: 'Festive',
    duration: '1.5 - 2 Hours',
    price: '₹2,000',
    basePrice: 2000,
    rating: '4.9 (190+ Celebrations)',
    badge: 'Festive Special',
    image: 'assets/images/mandala.jpg',
    description: 'Chic, auspicious festive henna for Karwa Chauth, Teej, Eid, Diwali, Baby Showers, or family festivities. Delicate center mandalas with intricate fingers and back-hand wrist bands.',
    included: [
      'Both Palms front & back up to wrists',
      'Traditional auspicious moon, floral, or geometric motifs',
      'Quick drying formulation with guaranteed dark stain',
      'Includes aftercare instructions'
    ]
  }
];

// Export to window if in browser
if (typeof window !== 'undefined') {
  window.MEHENDI_PRODUCTS = MEHENDI_PRODUCTS;
  window.MEHENDI_SERVICES = MEHENDI_SERVICES;
}
