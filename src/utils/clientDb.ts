import { Brand, Category, Product, StoreSettings } from '../types';

export const DEFAULT_BRANDS: Brand[] = [
  { id: 'b-khaadi', name: 'Khaadi', description: 'Renowned for its bright hand-woven craft fabrics and modern prints.', hidden: false },
  { id: 'b-sapphire', name: 'Sapphire', description: 'Premium quality lawn and ready-to-wear daily fabrics.', hidden: false },
  { id: 'b-j', name: 'J. (Junaid Jamshed)', description: 'Traditional sophistication with cultural heritage designs.', hidden: false },
  { id: 'b-limelight', name: 'Limelight', description: 'Trendy, fast-fashion fusion outfits and modern cuts.', hidden: false },
  { id: 'b-gulahmed', name: 'Gul Ahmed', description: 'Timeless lawn collection and luxury unstitched fabrics.', hidden: false },
  { id: 'b-bonanza', name: 'Bonanza Satrangi', description: 'Feminine, floral prints with premium textures.', hidden: false },
  { id: 'b-alkaram', name: 'Alkaram Studio', description: 'Chic designs styled with elegant pastel colorways.', hidden: false },
  { id: 'b-ethnic', name: 'Ethnic', description: 'Vibrant artistic prints inspired by sub-continental folklore.', hidden: false },
  { id: 'b-zellbury', name: 'Zellbury', description: 'Highly affordable daily-wear prints and contemporary cambrics.', hidden: false },
  { id: 'b-mariab', name: 'Maria B', description: 'Pakistans premier luxury designer unstitched and festive wear.', hidden: false },
  { id: 'b-beechtree', name: 'Beechtree', description: 'Graceful floral and geometric arrays tailored to modern lifestyle.', hidden: false },
  { id: 'b-nishat', name: 'Nishat Linen', description: 'One of Pakistans textile giants offering classic premium threads.', hidden: false },
  { id: 'b-saya', name: 'Saya', description: 'Sumptuous linen, lawn, and jacquard for elite statement wardrobes.', hidden: false },
  { id: 'b-crossstitch', name: 'Cross Stitch', description: 'Exquisite embroidery and premium silk-chiffon unstitched sets.', hidden: false },
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'c-3pc', name: '3-Piece Suits' },
  { id: 'c-2pc', name: '2-Piece Suits' },
  { id: 'c-kurtis', name: 'Kurtis' },
  { id: 'c-shirts', name: 'Shirts' },
  { id: 'c-trousers', name: 'Trouser Sets' },
  { id: 'c-lawn', name: 'Lawn Collection' },
  { id: 'c-winter', name: 'Winter Collection' },
  { id: 'c-luxury', name: 'Luxury Collection' },
  { id: 'c-casual', name: 'Casual Wear' },
  { id: 'c-festive', name: 'Festive Wear' },
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'p-khaadi-kh102',
    brandId: 'b-khaadi',
    brandName: 'Khaadi',
    categoryId: 'c-3pc',
    title: 'Floral Bloom Embroidered Lawn Suit',
    code: 'KH-102',
    fabric: 'Premium Lawn with Embroidered Chiffon Dupatta',
    pieces: '3-Piece',
    description: 'Bask in comfort with this gorgeous flower-printed 3-piece unstitched lawn outfit. Features rich intricate cross-stitch embroidery along the neckline, paired with a lightweight dupatta and dyed trousers.',
    careInstructions: 'Dry clean recommended. Wash dark colors separately. Do not bleach. Iron on medium heat.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop'
    ],
    featured: true,
    newArrival: true,
    hidden: false,
    variants: [
      { size: 'Small', color: 'Midnight Black', stock: 12 },
      { size: 'Medium', color: 'Midnight Black', stock: 15 },
      { size: 'Large', color: 'Midnight Black', stock: 8 },
      { size: 'Standard/XL', color: 'Midnight Black', stock: 5 },
      { size: 'Medium', color: 'Ruby Rose', stock: 10 }
    ]
  },
  {
    id: 'p-sapphire-sp205',
    brandId: 'b-sapphire',
    brandName: 'Sapphire',
    categoryId: 'c-2pc',
    title: 'Geometric Teal Printed Cambric Set',
    code: 'SP-205',
    fabric: 'High Quality Cambric Cotton',
    pieces: '2-Piece',
    description: 'Stay chic and effortless with Sapphire\'s daily wear 2-piece printed set, showcasing abstract modern geometric shapes with clean lace trimmings on sleeves.',
    careInstructions: 'Gentle hand wash. Line dry in shade. Avoid hot tumble dryers.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop'
    ],
    featured: true,
    newArrival: true,
    hidden: false,
    variants: [
      { size: 'Small', color: 'Emerald Teal', stock: 14 },
      { size: 'Medium', color: 'Emerald Teal', stock: 18 },
      { size: 'Large', color: 'Emerald Teal', stock: 10 },
      { size: 'Standard/XL', color: 'Emerald Teal', stock: 6 }
    ]
  },
  {
    id: 'p-limelight-ll318',
    brandId: 'b-limelight',
    brandName: 'Limelight',
    categoryId: 'c-2pc',
    title: 'Limelight Printed Cotton 2-Piece',
    code: 'LL-318',
    fabric: 'Premium Cambric Cotton',
    pieces: '2-Piece',
    description: 'A striking printed 2-piece set featuring gorgeous lime prints, styled meticulously with a refined collar and matching tapered trousers.',
    careInstructions: 'Do not twist. Dry clean suggested or gentle cold machine wash.',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop'
    ],
    featured: true,
    newArrival: true,
    hidden: false,
    variants: [
      { size: 'Small', color: 'Lemon Green', stock: 15 },
      { size: 'Medium', color: 'Lemon Green', stock: 15 }
    ]
  },
  {
    id: 'p-gulahmed-ga144',
    brandId: 'b-gulahmed',
    brandName: 'Gul Ahmed',
    categoryId: 'c-lawn',
    title: 'Gul Ahmed Summer Lawn Set',
    code: 'GA-144',
    fabric: 'Luxury Pima Lawn',
    pieces: '3-Piece',
    description: 'Celebrate true summer style with this soft Gul Ahmed 3-piece unstitched lawn article featuring premium chunri block print patterns and a dyed cotton dupatta.',
    careInstructions: 'Soak in cold water for 2 hours before stitching.',
    images: [
      'https://images.unsplash.com/photo-1608748010899-18f300247112?q=80&w=600&auto=format&fit=crop'
    ],
    featured: false,
    newArrival: false,
    hidden: false,
    variants: [
      { size: 'Small', color: 'Indigo Chunri', stock: 20 },
      { size: 'Medium', color: 'Indigo Chunri', stock: 25 },
      { size: 'Large', color: 'Indigo Chunri', stock: 12 }
    ]
  },
  {
    id: 'p-bonanza-bs227',
    brandId: 'b-bonanza',
    brandName: 'Bonanza Satrangi',
    categoryId: 'c-winter',
    title: 'Bonanza Satrangi Khaddar Suit',
    code: 'BS-227',
    fabric: 'Thick Premium Winter Khaddar',
    pieces: '3-Piece',
    description: 'Authentic winter-focused Satrangi khaddar print embellished with detailed thread embroideries. Keeps you warm and extremely comfortable.',
    careInstructions: 'Iron at medium-high. Dry in shade.',
    images: [
      'https://images.unsplash.com/photo-1561053720-76cd73ff22c3?q=80&w=600&auto=format&fit=crop'
    ],
    featured: true,
    newArrival: false,
    hidden: false,
    variants: [
      { size: 'Medium', color: 'Mahogany Peach', stock: 15 },
      { size: 'Large', color: 'Mahogany Peach', stock: 10 }
    ]
  },
  {
    id: 'p-j-jj405',
    brandId: 'b-j',
    brandName: 'J. (Junaid Jamshed)',
    categoryId: 'c-3pc',
    title: 'J. Traditional Block Print Lawn Set',
    code: 'JJ-405',
    fabric: 'Fine Voile Lawn',
    pieces: '3-Piece',
    description: 'A beautiful traditional lawn collection by Junaid Jamshed. Displaying elegant historical block prints paired with premium trousers and a lightweight dupatta.',
    careInstructions: 'Wash gold paste prints inside out.',
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop'
    ],
    featured: true,
    newArrival: true,
    hidden: false,
    variants: [
      { size: 'Small', color: 'Mint Pastel', stock: 12 },
      { size: 'Medium', color: 'Mint Pastel', stock: 18 },
      { size: 'Large', color: 'Mint Pastel', stock: 8 }
    ]
  },
  {
    id: 'p-mariab-mb501',
    brandId: 'b-mariab',
    brandName: 'Maria B',
    categoryId: 'c-luxury',
    title: 'Maria B Luxury Wedding Collection',
    code: 'MB-501',
    fabric: 'Pure Organza & Silk Net',
    pieces: '3-Piece',
    description: 'Breathtaking heavy festive embroidery curated by Maria B. Features real tilla embroidery, pearl borders, and premium shimmer slip fabric.',
    careInstructions: 'Strictly dry clean only. Handle delicate beads with care.',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop'
    ],
    featured: true,
    newArrival: true,
    hidden: false,
    variants: [
      { size: 'Small', color: 'Blush Pink', stock: 8 },
      { size: 'Medium', color: 'Blush Pink', stock: 10 },
      { size: 'Large', color: 'Blush Pink', stock: 6 }
    ]
  },
  {
    id: 'p-ethnic-et602',
    brandId: 'b-ethnic',
    brandName: 'Ethnic',
    categoryId: 'c-casual',
    title: 'Ethnic Indigo Craft Block Print Kurta',
    code: 'ET-602',
    fabric: '100% Slub Khaddar',
    pieces: 'Kurti',
    description: 'Vibrant artistic print inspired by Pakistani folklore. Features wooden buttons, round neck, and standard pocket slots.',
    careInstructions: 'Wash separately as indigo might run.',
    images: [
      'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?q=80&w=600&auto=format&fit=crop'
    ],
    featured: false,
    newArrival: true,
    hidden: false,
    variants: [
      { size: 'Small', color: 'Deep Indigo', stock: 15 },
      { size: 'Medium', color: 'Deep Indigo', stock: 20 },
      { size: 'Large', color: 'Deep Indigo', stock: 12 }
    ]
  },
  {
    id: 'p-beechtree-bt701',
    brandId: 'b-beechtree',
    brandName: 'Beechtree',
    categoryId: 'c-2pc',
    title: 'Beechtree Teal Blossoms Cambric Set',
    code: 'BT-701',
    fabric: 'Premium Cambric Cotton',
    pieces: '2-Piece',
    description: 'Vivid teal blue tones embellished with white floral handwork. This Beechtree cambric set offers maximum wearability in summer and autumn.',
    careInstructions: 'Machine wash warm. Do not bleach.',
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop'
    ],
    featured: true,
    newArrival: true,
    hidden: false,
    variants: [
      { size: 'Small', color: 'Teal Blue', stock: 12 },
      { size: 'Medium', color: 'Teal Blue', stock: 15 },
      { size: 'Large', color: 'Teal Blue', stock: 10 }
    ]
  },
  {
    id: 'p-nishat-nl805',
    brandId: 'b-nishat',
    brandName: 'Nishat Linen',
    categoryId: 'c-lawn',
    title: 'Nishat Linen Premium Lawn Set',
    code: 'NL-805',
    fabric: 'Nishat Swiss Lawn',
    pieces: '3-Piece',
    description: 'A masterful monotone geometric composition by Nishat. Includes slub-cotton printed dupatta and high density wear resistant trousers.',
    careInstructions: 'Shrink in plain soft water prior to stitching.',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop'
    ],
    featured: true,
    newArrival: true,
    hidden: false,
    variants: [
      { size: 'Medium', color: 'Monochrome Slate', stock: 20 },
      { size: 'Large', color: 'Monochrome Slate', stock: 14 },
      { size: 'Standard/XL', color: 'Monochrome Slate', stock: 8 }
    ]
  }
];

export const DEFAULT_SETTINGS: StoreSettings = {
  whatsappNumber: '+923001234567',
  instagramUrl: 'https://instagram.com/zarire_sell_pk',
  facebookUrl: 'https://facebook.com/zariresell',
  flatShippingFee: 250,
  freeShippingThreshold: 5000,
  shippingTimeEstimate: '3 to 5 business days nationwide',
  codAvailable: true,
  paymentAccounts: [
    {
      method: 'Bank Transfer',
      title: 'Zari Reseller Stores Pvt.',
      number: 'Meezan Bank - 0281098320492834',
      instructions: 'Transfer the amount to the provided Meezan bank account, then upload a screenshot of your successful transaction receipt.'
    },
    {
      method: 'EasyPaisa',
      title: 'Aisha Imran - EasyPaisa Merchant',
      number: '0300-1234567',
      instructions: 'Pay via EasyPaisa App or USSD code to our account, and provide the transaction ID / screenshot.'
    },
    {
      method: 'JazzCash',
      title: 'Aisha Imran - JazzCash',
      number: '0300-1234567',
      instructions: 'Transfer the exact amount to the mobile number listed above.'
    }
  ],
  tiers: [
    { id: 't1', name: 'Standard Pricing (1-4 Pieces)', minQty: 1, maxQty: 4, rate: 2000 },
    { id: 't2', name: 'Mid-Tier Discount (5-9 Pieces)', minQty: 5, maxQty: 9, rate: 1900 },
    { id: 't3', name: 'Wholesale Group Rate (10+ Pieces)', minQty: 10, maxQty: null, rate: 1800 }
  ],
  pages: {
    aboutUs: 'Welcome to Zari Resell, your premier independent destination for selecting and curating authentic designer clothing.',
    contactUs: 'Have questions? Our support team is here to help 24/7. Text or WhatsApp us anytime at +923001234567.',
    shipPolicy: 'We offer FLAT Rs. 250 shipping nationwide across Pakistan. For orders over Rs. 5,000, shipping is absolutely FREE!',
    returnPolicy: 'We want you to be completely satisfied. We offer a simple, hassle-free 7-day Return & Exchange policy.',
    privacyPolicy: 'We value your privacy deeply. All customer information is stored securely.',
    terms: 'Zari Resell is an independent womens clothing reseller.',
    paymentPolicy: 'To support all shoppers, we offer full Cash on Delivery (COD) nationwide.'
  }
};
