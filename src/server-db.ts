import * as fs from 'fs';
import * as path from 'path';
import { DatabaseSchema, Brand, Category, Product, StoreSettings, Order } from './types.js';

const DB_FILE_PATH = path.join(process.cwd(), 'db.json');

const DEFAULT_BRANDS: Brand[] = [
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

const DEFAULT_CATEGORIES: Category[] = [
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

const DEFAULT_PRODUCTS: Product[] = [
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
  },
  {
    id: 'p-saya-sy901',
    brandId: 'b-saya',
    brandName: 'Saya',
    categoryId: 'c-festive',
    title: 'Saya Jacquard Gold Printed Set',
    code: 'SY-901',
    fabric: 'Silk-Weft Jacquard',
    pieces: '3-Piece',
    description: 'Shine in family gathers with Saya gold printed Jacquard suit. Delicate tilla borders outline the dupatta beautifully.',
    careInstructions: 'Wash inside-out. Avoid wringing.',
    images: [
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=600&auto=format&fit=crop'
    ],
    featured: false,
    newArrival: true,
    hidden: false,
    variants: [
      { size: 'Small', color: 'Gold Mustard', stock: 10 },
      { size: 'Medium', color: 'Gold Mustard', stock: 15 },
      { size: 'Large', color: 'Gold Mustard', stock: 8 }
    ]
  },
  {
    id: 'p-cross-cs110',
    brandId: 'b-crossstitch',
    brandName: 'Cross Stitch',
    categoryId: 'c-luxury',
    title: 'Cross Stitch Embroidered Chiffon Suit',
    code: 'CS-110',
    fabric: 'Fine Lawn & Embroidered Crinkle Chiffon',
    pieces: '3-Piece',
    description: 'Pre-selected premium reseller unstitched piece from Cross Stitch, featuring pastel pink hues and fully embroidered borders.',
    careInstructions: 'Dry clean recommended.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop'
    ],
    featured: true,
    newArrival: false,
    hidden: false,
    variants: [
      { size: 'Small', color: 'Pastel Orchid', stock: 12 },
      { size: 'Medium', color: 'Pastel Orchid', stock: 18 }
    ]
  },
  // Additional Products to reach 30-40 unique items
  {
    id: 'p-khaadi-kh105',
    brandId: 'b-khaadi',
    brandName: 'Khaadi',
    categoryId: 'c-2pc',
    title: 'Crimson Bloom Printed Linen Outfit',
    code: 'KH-105',
    fabric: 'Soft Cotton Linen Blend',
    pieces: '2-Piece',
    description: 'Contemporary two-piece stitched suit showcasing bold crimson red textures and block floral prints.',
    careInstructions: 'Machine wash delicate. Tumble dry on low settings.',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop'],
    featured: false,
    newArrival: true,
    hidden: false,
    variants: [{ size: 'Small', color: 'Crimson Red', stock: 15 }, { size: 'Medium', color: 'Crimson Red', stock: 20 }]
  },
  {
    id: 'p-sapphire-sp209',
    brandId: 'b-sapphire',
    brandName: 'Sapphire',
    categoryId: 'c-trousers',
    title: 'Sapphire Mustard Gold Solid Set',
    code: 'SP-209',
    fabric: 'Summer Cotton Karandi',
    pieces: '2-Piece',
    description: 'A sleek solid yellow co-ord attire representing classic Sapphire minimalism. Includes button down shirt and loose trousers.',
    careInstructions: 'Wash dark colors separately. Warm iron.',
    images: ['https://images.unsplash.com/photo-1561053720-76cd73ff22c3?q=80&w=600&auto=format&fit=crop'],
    featured: false,
    newArrival: false,
    hidden: false,
    variants: [{ size: 'Medium', color: 'Mustard Gold', stock: 15 }, { size: 'Large', color: 'Mustard Gold', stock: 12 }]
  },
  {
    id: 'p-limelight-ll325',
    brandId: 'b-limelight',
    brandName: 'Limelight',
    categoryId: 'c-kurtis',
    title: 'Embroidered Kurta Slate Gray',
    code: 'LL-325',
    fabric: 'Fine Pima Cotton',
    pieces: 'Kurti',
    description: 'Charcoal gray daily kurta with beautifully done white tilla threads across collar and sleeves.',
    careInstructions: 'Hand wash cold. Line dry.',
    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop'],
    featured: true,
    newArrival: true,
    hidden: false,
    variants: [{ size: 'Small', color: 'Slate Gray', stock: 22 }, { size: 'Medium', color: 'Slate Gray', stock: 30 }]
  },
  {
    id: 'p-gulahmed-ga150',
    brandId: 'b-gulahmed',
    brandName: 'Gul Ahmed',
    categoryId: 'c-3pc',
    title: 'Ethnic Paisley Unstitched Set',
    code: 'GA-150',
    fabric: 'Premium Mercerized Lawn',
    pieces: '3-Piece',
    description: 'Authentic reseller article from Gul Ahmed. Royal indigo base printed with dense gold paisley motifs.',
    careInstructions: 'Dry clean recommended.',
    images: ['https://images.unsplash.com/photo-1608748010899-18f300247112?q=80&w=600&auto=format&fit=crop'],
    featured: false,
    newArrival: true,
    hidden: false,
    variants: [{ size: 'Small', color: 'Royal Violet', stock: 10 }, { size: 'Medium', color: 'Royal Violet', stock: 15 }]
  },
  {
    id: 'p-bonanza-bs230',
    brandId: 'b-bonanza',
    brandName: 'Bonanza Satrangi',
    categoryId: 'c-lawn',
    title: 'Ocean Blue Voile Dupatta Set',
    code: 'BS-230',
    fabric: 'Lawn with Swiss Voile Dupatta',
    pieces: '3-Piece',
    description: 'Immerse in pure soft cotton textures with Bonanza ocean prints. Unstitched and perfect to customize.',
    careInstructions: 'Soak unstitched cloth before stitching.',
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop'],
    featured: false,
    newArrival: true,
    hidden: false,
    variants: [{ size: 'Medium', color: 'Ocean Turquoise', stock: 14 }]
  },
  {
    id: 'p-alkaram-ak180',
    brandId: 'b-alkaram',
    brandName: 'Alkaram Studio',
    categoryId: 'c-3pc',
    title: 'Mint Rose Chic Cambric 3-Piece',
    code: 'AK-180',
    fabric: 'High Density Fine Cambric',
    pieces: '3-Piece',
    description: 'Luxurious pastel series by Alkaram. Delicate rose patterns highlight the neckline frame beautifully.',
    careInstructions: 'Avoid harsh brush cleaning.',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop'],
    featured: true,
    newArrival: false,
    hidden: false,
    variants: [{ size: 'Small', color: 'Mint Pastel', stock: 15 }, { size: 'Medium', color: 'Mint Pastel', stock: 18 }]
  },
  {
    id: 'p-ethnic-et610',
    brandId: 'b-ethnic',
    brandName: 'Ethnic',
    categoryId: 'c-kurtis',
    title: 'Embroidered Mustard Tassel Kurta',
    code: 'ET-610',
    fabric: 'Soft Slub Lawn Cotton',
    pieces: 'Kurti',
    description: 'Bohemian inspired ethnic cuts. Adorned with thread tassels and mirrors along the neckline.',
    careInstructions: 'Gentle hand wash inside out.',
    images: ['https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?q=80&w=600&auto=format&fit=crop'],
    featured: true,
    newArrival: true,
    hidden: false,
    variants: [{ size: 'Medium', color: 'Amber Mustard', stock: 25 }, { size: 'Large', color: 'Amber Mustard', stock: 10 }]
  },
  {
    id: 'p-zellbury-zb408',
    brandId: 'b-zellbury',
    brandName: 'Zellbury',
    categoryId: 'c-trousers',
    title: 'Burgundy Co-ord Raw Cambric Set',
    code: 'ZB-408',
    fabric: '100% Raw Cambric',
    pieces: '2-Piece',
    description: 'Deep burgundy shades tailored in modern comfortable loose-fit Pakistani dimensions. Casual daily styling.',
    careInstructions: 'Wash separately. Warm heat iron.',
    images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop'],
    featured: false,
    newArrival: true,
    hidden: false,
    variants: [{ size: 'Small', color: 'Dark Burgundy', stock: 12 }, { size: 'Medium', color: 'Dark Burgundy', stock: 16 }]
  },
  {
    id: 'p-mariab-mb505',
    brandId: 'b-mariab',
    brandName: 'Maria B',
    categoryId: 'c-luxury',
    title: 'Velvet Trimming Sateen Luxury Suit',
    code: 'MB-505',
    fabric: 'Mercerized Peach Sateen & Velvet',
    pieces: '3-Piece',
    description: 'Prestige winter luxury by Maria B. Heavy embroidered sateen fabric packaged with plush velvet shawls.',
    careInstructions: 'Dry clean only. Store in garment bags.',
    images: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop'],
    featured: true,
    newArrival: false,
    hidden: false,
    variants: [{ size: 'Medium', color: 'Velvet Plum', stock: 6 }, { size: 'Large', color: 'Velvet Plum', stock: 4 }]
  },
  {
    id: 'p-beechtree-bt708',
    brandId: 'b-beechtree',
    brandName: 'Beechtree',
    categoryId: 'c-casual',
    title: 'Coral Meadow Festive Unstitched Kurta',
    code: 'BT-708',
    fabric: 'Embossed Poly Lawn',
    pieces: 'Kurti',
    description: 'Gleaming coral base featuring beautiful white screen print arrays and embroidered lace attachments.',
    careInstructions: 'Cold hand wash with mild detergent.',
    images: ['https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=600&auto=format&fit=crop'],
    featured: false,
    newArrival: true,
    hidden: false,
    variants: [{ size: 'Small', color: 'Coral Pink', stock: 15 }]
  },
  {
    id: 'p-nishat-nl812',
    brandId: 'b-nishat',
    brandName: 'Nishat Linen',
    categoryId: 'c-lawn',
    title: 'Marigold Bloom Premium Lawn Outfit',
    code: 'NL-812',
    fabric: 'High Count Pima Cotton Lawn',
    pieces: '3-Piece',
    description: 'An outstanding golden yellow floral print by Nishat Linen, capturing real marigold gardens details, unstitched pack.',
    careInstructions: 'Hand wash warm. Do not soak canvas with colors mixed.',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop'],
    featured: true,
    newArrival: true,
    hidden: false,
    variants: [{ size: 'Medium', color: 'Sunny Marigold', stock: 20 }]
  },
  {
    id: 'p-saya-sy908',
    brandId: 'b-saya',
    brandName: 'Saya',
    categoryId: 'c-kurtis',
    title: 'Classic White Self-Jacquard Kurta',
    code: 'SY-908',
    fabric: 'Pure Self-Pattern Cotton Jacquard',
    pieces: 'Kurti',
    description: 'Elegance in white. Intricate geometric self-weaver patterns. Adorned with premium mother-of-pearl buttons.',
    careInstructions: 'Gentle whitening agents safely acceptable.',
    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop'],
    featured: false,
    newArrival: false,
    hidden: false,
    variants: [{ size: 'Small', color: 'Pure Ivory', stock: 15 }, { size: 'Medium', color: 'Pure Ivory', stock: 18 }, { size: 'Large', color: 'Pure Ivory', stock: 10 }]
  },
  {
    id: 'p-cross-cs116',
    brandId: 'b-crossstitch',
    brandName: 'Cross Stitch',
    categoryId: 'c-3pc',
    title: 'Ivory Chantilly Lace 3-Piece Pack',
    code: 'CS-116',
    fabric: 'Swiss Voile & Chantilly Net Lace',
    pieces: '3-Piece',
    description: 'Luxury unstitched reselling item from Cross Stitch. Includes embroidered lace borders and silk dupatta.',
    careInstructions: 'Dry clean recommended.',
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop'],
    featured: true,
    newArrival: true,
    hidden: false,
    variants: [{ size: 'Medium', color: 'Chantilly Cream', stock: 8 }, { size: 'Large', color: 'Chantilly Cream', stock: 6 }]
  },
  {
    id: 'p-alkaram-ak190',
    brandId: 'b-alkaram',
    brandName: 'Alkaram Studio',
    categoryId: 'c-2pc',
    title: 'Pastel Lavender Khaddar Dailywear',
    code: 'AK-190',
    fabric: 'Premium Light Khaddar',
    pieces: '2-Piece',
    description: 'Chic geometric motifs on premium lavender khaddar backdrop. Perfect for daily office or college wear.',
    careInstructions: 'Wash inside-out. Do not dry in heat dryers.',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop'],
    featured: false,
    newArrival: true,
    hidden: false,
    variants: [{ size: 'Small', color: 'Lavender Field', stock: 12 }, { size: 'Medium', color: 'Lavender Field', stock: 18 }]
  },
  {
    id: 'p-zellbury-zb412',
    brandId: 'b-zellbury',
    brandName: 'Zellbury',
    categoryId: 'c-3pc',
    title: 'Zellbury Classic Lawn 3-Piece suit',
    code: 'ZB-412',
    fabric: 'Soft Daily Lawn Cotton',
    pieces: '3-Piece',
    description: 'Stunning geometric tribal print unstitched 3-piece set at highly competitive daily price margins.',
    careInstructions: 'Wash cold. Light ironing.',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop'],
    featured: false,
    newArrival: false,
    hidden: false,
    variants: [{ size: 'Medium', color: 'Aztec Bronze', stock: 15 }, { size: 'Large', color: 'Aztec Bronze', stock: 10 }]
  },
  {
    id: 'p-beechtree-bt715',
    brandId: 'b-beechtree',
    brandName: 'Beechtree',
    categoryId: 'c-2pc',
    title: 'Crimson Meadow Linen Co-ord',
    code: 'BT-715',
    fabric: 'Blended Soft Linen',
    pieces: '2-Piece',
    description: 'A cozy Crimson red patterned Beechtree stitched piece featuring sleek straight sleeves and cigarette trousers.',
    careInstructions: 'Iron on medium steam settings.',
    images: ['https://images.unsplash.com/photo-1561053720-76cd73ff22c3?q=80&w=600&auto=format&fit=crop'],
    featured: true,
    newArrival: true,
    hidden: false,
    variants: [{ size: 'Small', color: 'Crimson Floral', stock: 12 }, { size: 'Medium', color: 'Crimson Floral', stock: 15 }]
  },
  {
    id: 'p-j-jj420',
    brandId: 'b-j',
    brandName: 'J. (Junaid Jamshed)',
    categoryId: 'c-3pc',
    title: 'Traditional Chunri Block Royal Set',
    code: 'JJ-420',
    fabric: 'Mercerized Voile & Lawn',
    pieces: '3-Piece',
    description: 'An outstanding Pakistani festive chunri block printed unstitched costume set in highly lively yellow-green textures.',
    careInstructions: 'Gently hand wash in plain cool water.',
    images: ['https://images.unsplash.com/photo-1608748010899-18f300247112?q=80&w=600&auto=format&fit=crop'],
    featured: true,
    newArrival: false,
    hidden: false,
    variants: [{ size: 'Medium', color: 'Chunri Saffron', stock: 24 }]
  },
  {
    id: 'p-limelight-ll342',
    brandId: 'b-limelight',
    brandName: 'Limelight',
    categoryId: 'c-trousers',
    title: 'Linen Fusion Co-ord Trouser Set',
    code: 'LL-342',
    fabric: '100% Breathable Linen',
    pieces: '2-Piece',
    description: 'Limelight contemporary solid color style featuring beige soft shirt and culottes block styling.',
    careInstructions: 'Dry inside out in shade.',
    images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop'],
    featured: false,
    newArrival: true,
    hidden: false,
    variants: [{ size: 'Medium', color: 'Beige Cream', stock: 18 }, { size: 'Large', color: 'Beige Cream', stock: 12 }]
  },
  {
    id: 'p-gulahmed-ga175',
    brandId: 'b-gulahmed',
    brandName: 'Gul Ahmed',
    categoryId: 'c-luxury',
    title: 'Gold Print Sateen Silk 3-Piece',
    code: 'GA-175',
    fabric: 'Mercerized Pima Sateen & Fine Silk',
    pieces: '3-Piece',
    description: 'Treat your festive catalog to this majestic authentic Gul Ahmed golden printed sateen suit with pure silk dupatta.',
    careInstructions: 'Dry clean prioritised.',
    images: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop'],
    featured: true,
    newArrival: false,
    hidden: false,
    variants: [{ size: 'Small', color: 'Sapphire Royal', stock: 10 }, { size: 'Medium', color: 'Sapphire Royal', stock: 12 }]
  },
  {
    id: 'p-alkaram-ak195',
    brandId: 'b-alkaram',
    brandName: 'Alkaram Studio',
    categoryId: 'c-lawn',
    title: 'Lavender Fields Voile Dupatta Set',
    code: 'AK-195',
    fabric: 'Lawn with Premium Voile',
    pieces: '3-Piece',
    description: 'Stay completely cool and relaxed in summer afternoon gathers with Alkaram premium Voile lawn array.',
    careInstructions: 'Soak unstitched fabric properly.',
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop'],
    featured: false,
    newArrival: true,
    hidden: false,
    variants: [{ size: 'Medium', color: 'Orchid Dream', stock: 20 }]
  },
  {
    id: 'p-nishat-nl825',
    brandId: 'b-nishat',
    brandName: 'Nishat Linen',
    categoryId: 'c-winter',
    title: 'Royal Karandi Embroidered Suit',
    code: 'NL-825',
    fabric: 'Fine Woven Karandi Dupatta & Trousers',
    pieces: '3-Piece',
    description: 'Ultra warmth meets premium Pakistani traditional styling. Heavily stitched patterns on thick Karandi framework.',
    careInstructions: 'Dry clean recommended only.',
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop'],
    featured: true,
    newArrival: true,
    hidden: false,
    variants: [{ size: 'Medium', color: 'Forest Green', stock: 15 }, { size: 'Large', color: 'Forest Green', stock: 12 }]
  },
  {
    id: 'p-saya-sy920',
    brandId: 'b-saya',
    brandName: 'Saya',
    categoryId: 'c-casual',
    title: 'Lime Yellow Cambric Kurta Pack',
    code: 'SY-920',
    fabric: 'High Count Cambric Cotton',
    pieces: 'Kurti',
    description: 'Perfect cheerful color. Adorned with delicate embroidery details along cuffs and side pockets.',
    careInstructions: 'Wash inside out with cold settings.',
    images: ['https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?q=80&w=600&auto=format&fit=crop'],
    featured: false,
    newArrival: true,
    hidden: false,
    variants: [{ size: 'Small', color: 'Lime Glow', stock: 18 }, { size: 'Medium', color: 'Lime Glow', stock: 15 }]
  },
  {
    id: 'p-cross-cs125',
    brandId: 'b-crossstitch',
    brandName: 'Cross Stitch',
    categoryId: 'c-lawn',
    title: 'Olive Green Silk Border Lawn 3PC',
    code: 'CS-125',
    fabric: 'Mercerized Classic Lawn',
    pieces: '3-Piece',
    description: 'Luxury multi-brand reseller item of Cross Stitch. Displays heavy border embroidery coupled with plain trousers.',
    careInstructions: 'Easy low bleach detergent, normal cold rinse.',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop'],
    featured: true,
    newArrival: false,
    hidden: false,
    variants: [{ size: 'Medium', color: 'Olive Green', stock: 16 }, { size: 'Large', color: 'Olive Green', stock: 12 }]
  }
];

const DEFAULT_SETTINGS: StoreSettings = {
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
    aboutUs: 'Welcome to Zari Resell, your premier independent destination for selecting and curating authentic designer clothing. We specialize in sourcing original clothing collections from major premium Pakistani brands (including Khaadi, Sapphire, J., Limelight, Ethnic, Zellbury, and Maria B) and reselling them strictly as an independent retailer. This allows you to mix and match multiple designer brands in a single order to claim maximum bulk wholesale pricing! Our custom automated warehouse allows us to process mixed-brand cartons at fraction of the price of official retail shops.',
    contactUs: 'Have questions? Our support team is here to help 24/7. Text or WhatsApp us anytime at +923001234567 or email us at support@zariresell.com. Real human representative will assist you with verifying stocks, sizes, or shipment details.',
    shipPolicy: 'We offer FLAT Rs. 250 shipping nationwide across Pakistan. For orders over Rs. 5,000, shipping is absolutely FREE! Orders are dispatched from our Lahore logistics center within 24 hours of confirmation. Delivery takes 3 to 5 business days depending on city and province (Punjab, Sindh, KPK, Balochistan). Trackings are shared relative to Cash on Delivery (COD) or bank transfer logs.',
    returnPolicy: 'We want you to be completely satisfied. We offer a simple, hassle-free 7-day Return & Exchange policy. If your article does not fit, or if there is any defect, please initiate an exchange by contacting our WhatsApp chat. Please ensure the article is unstitched, unused, with tags fully attached. Customers cover return shipping fees unless it is our defect.',
    privacyPolicy: 'We value your privacy deeply. All customer information, including mobile numbers, shipping addresses, email addresses, and landmark notes, are stored offline securely strictly for completing delivery and dispatch. None of your personal details are shared with unverified marketing handlers.',
    terms: 'Zari Resell is an independent womens clothing reseller. All brand names, brand logos, motifs, designs, and trademarks displayed on this platform belong entirely to their respective copyright holders (such as Sapphire, Khaadi, Limelight, Maria B). Our listings indicate product source but do not claim endorsement from the respective brand.',
    paymentPolicy: 'To support all shoppers, we offer full Cash on Delivery (COD) nationwide. Additionally, we support immediate discounts verification by paying upfront using Meezan Bank deposit, EasyPaisa, or JazzCash. For upfront payments, your order confirms instantly once the receipt screenshot or receipt ID matches.'
  }
};

let db: DatabaseSchema = {
  brands: DEFAULT_BRANDS,
  categories: DEFAULT_CATEGORIES,
  products: DEFAULT_PRODUCTS,
  orders: [],
  settings: DEFAULT_SETTINGS,
};

// Auto-load on load
export function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const dataStr = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const loaded = JSON.parse(dataStr) as DatabaseSchema;
      // Safeguard against missing fields or low product count
      if (loaded.brands && loaded.categories && loaded.products && loaded.products.length >= 25 && loaded.settings) {
        db = loaded;
      } else {
        // Force upgrade the database to include high fidelity seeds
        db.orders = loaded.orders || [];
        db.settings = loaded.settings || DEFAULT_SETTINGS;
        db.brands = DEFAULT_BRANDS;
        db.categories = DEFAULT_CATEGORIES;
        db.products = DEFAULT_PRODUCTS;
        saveDatabase();
      }
    } else {
      saveDatabase(); // seed write
    }
  } catch (err) {
    console.error('Failed to load database. fallback to seeds used: ', err);
  }
  return db;
}

export function saveDatabase(): void {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save database to disk: ', err);
  }
}

export function getDatabase(): DatabaseSchema {
  return db;
}
