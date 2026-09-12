import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ENV } from '../config/env';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Purchase } from '../models/Purchase';
import { FitFeedback } from '../models/FitFeedback';
import { ExperimentConfig } from '../models/ExperimentConfig';

const productsData = [
  {
    name: 'AeroTech Performance Dri-FIT Tee',
    brand: 'AeroAthletics',
    category: 'T-shirts',
    price: 49.99,
    description: 'Lightweight, moisture-wicking athletic T-shirt designed with 4-way stretch fabric for maximum movement.',
    fitType: 'regular',
    fabric: '88% Polyester, 12% Elastane',
    stretchLevel: 'high',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChart: {
      S: { chestCm: 92, shoulderCm: 43, lengthCm: 69, sleeveCm: 20 },
      M: { chestCm: 100, shoulderCm: 45, lengthCm: 71, sleeveCm: 21 },
      L: { chestCm: 108, shoulderCm: 47, lengthCm: 73, sleeveCm: 22 },
      XL: { chestCm: 116, shoulderCm: 49, lengthCm: 75, sleeveCm: 23 }
    },
    availableStock: 120,
    tags: ['athletic', 'dri-fit', 'stretch', 'gym'],
    brandFitOffsetCm: 0
  },
  {
    name: 'Nordic Slim-Fit Linen Shirt',
    brand: 'UrbanCraft',
    category: 'Shirts',
    price: 69.99,
    description: 'Crisp tailored linen button-down shirt designed for smart casual wear. Cut slim through the waist.',
    fitType: 'slim',
    fabric: '100% Organic Linen',
    stretchLevel: 'none',
    images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChart: {
      S: { chestCm: 90, shoulderCm: 42, lengthCm: 70, sleeveCm: 62 },
      M: { chestCm: 96, shoulderCm: 44, lengthCm: 72, sleeveCm: 64 },
      L: { chestCm: 104, shoulderCm: 46, lengthCm: 74, sleeveCm: 65 },
      XL: { chestCm: 112, shoulderCm: 48, lengthCm: 76, sleeveCm: 67 }
    },
    availableStock: 45,
    tags: ['formal', 'linen', 'slim-fit'],
    brandFitOffsetCm: -2
  },
  {
    name: 'Apex Heavyweight Streetwear Hoodie',
    brand: 'ApexStudio',
    category: 'Hoodies',
    price: 89.99,
    description: 'Premium 450GSM French terry cotton hoodie featuring dropped shoulders and a boxy, relaxed profile.',
    fitType: 'oversized',
    fabric: '100% French Terry Cotton',
    stretchLevel: 'low',
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChart: {
      S: { chestCm: 110, shoulderCm: 52, lengthCm: 68, sleeveCm: 58 },
      M: { chestCm: 118, shoulderCm: 55, lengthCm: 71, sleeveCm: 60 },
      L: { chestCm: 126, shoulderCm: 58, lengthCm: 74, sleeveCm: 62 },
      XL: { chestCm: 134, shoulderCm: 61, lengthCm: 77, sleeveCm: 64 }
    },
    availableStock: 60,
    tags: ['streetwear', 'heavyweight', 'oversized'],
    brandFitOffsetCm: 3
  },
  {
    name: 'RawTough Tapered Selvedge Jeans',
    brand: 'DenimWorks',
    category: 'Jeans',
    price: 119.99,
    description: 'Japanese raw selvedge denim tailored with a modern tapered leg profile.',
    fitType: 'slim',
    fabric: '99% Cotton, 1% Elastane Selvedge',
    stretchLevel: 'low',
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChart: {
      S: { waistCm: 76, lengthCm: 102 },
      M: { waistCm: 84, lengthCm: 104 },
      L: { waistCm: 92, lengthCm: 106 },
      XL: { waistCm: 100, lengthCm: 108 }
    },
    availableStock: 35,
    tags: ['denim', 'selvedge', 'tapered'],
    brandFitOffsetCm: -1
  },
  {
    name: 'Metro Stretch Chino Trousers',
    brand: 'UrbanCraft',
    category: 'Trousers',
    price: 79.99,
    description: 'Versatile stretch cotton chinos with a clean flat-front waistband and tailored leg silhouette.',
    fitType: 'regular',
    fabric: '97% Cotton, 3% Elastane',
    stretchLevel: 'medium',
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChart: {
      S: { waistCm: 78, lengthCm: 100 },
      M: { waistCm: 86, lengthCm: 102 },
      L: { waistCm: 94, lengthCm: 104 },
      XL: { waistCm: 102, lengthCm: 106 }
    },
    availableStock: 80,
    tags: ['chinos', 'workwear', 'stretch'],
    brandFitOffsetCm: 0
  },
  {
    name: 'Classic Vintage Cotton Crewneck Tee',
    brand: 'UrbanCraft',
    category: 'T-shirts',
    price: 34.99,
    description: 'Ultra-soft combed ring-spun cotton tee pre-shrunk for a consistent everyday regular fit.',
    fitType: 'regular',
    fabric: '100% Combed Cotton',
    stretchLevel: 'medium',
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChart: {
      S: { chestCm: 94, shoulderCm: 44, lengthCm: 70, sleeveCm: 20 },
      M: { chestCm: 102, shoulderCm: 46, lengthCm: 72, sleeveCm: 21 },
      L: { chestCm: 110, shoulderCm: 48, lengthCm: 74, sleeveCm: 22 },
      XL: { chestCm: 118, shoulderCm: 50, lengthCm: 76, sleeveCm: 23 }
    },
    availableStock: 200,
    tags: ['basics', 'vintage', 'crewneck'],
    brandFitOffsetCm: 0
  },
  {
    name: 'Velocity Zip-Up Fleece Hoodie',
    brand: 'AeroAthletics',
    category: 'Hoodies',
    price: 74.99,
    description: 'Therma-warm brushed fleece zip hoodie with zippered hand pockets and contoured storm hood.',
    fitType: 'regular',
    fabric: '80% Cotton, 20% Polyester',
    stretchLevel: 'medium',
    images: ['https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChart: {
      S: { chestCm: 102, shoulderCm: 46, lengthCm: 68, sleeveCm: 62 },
      M: { chestCm: 110, shoulderCm: 48, lengthCm: 71, sleeveCm: 64 },
      L: { chestCm: 118, shoulderCm: 50, lengthCm: 74, sleeveCm: 66 },
      XL: { chestCm: 126, shoulderCm: 52, lengthCm: 77, sleeveCm: 68 }
    },
    availableStock: 90,
    tags: ['zip-hoodie', 'fleece', 'athletic'],
    brandFitOffsetCm: 1
  },
  {
    name: 'Oxford Heritage Button-Down Shirt',
    brand: 'HeritageThread',
    category: 'Shirts',
    price: 84.99,
    description: 'Classic heavy Oxford cloth woven shirt with durable box pleat back and button-collar detailing.',
    fitType: 'regular',
    fabric: '100% Oxford Cotton',
    stretchLevel: 'none',
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChart: {
      S: { chestCm: 96, shoulderCm: 44, lengthCm: 72, sleeveCm: 63 },
      M: { chestCm: 104, shoulderCm: 46, lengthCm: 74, sleeveCm: 65 },
      L: { chestCm: 112, shoulderCm: 48, lengthCm: 76, sleeveCm: 66 },
      XL: { chestCm: 120, shoulderCm: 50, lengthCm: 78, sleeveCm: 68 }
    },
    availableStock: 50,
    tags: ['oxford', 'heritage', 'classic'],
    brandFitOffsetCm: 0
  },
  {
    name: 'FlexFit Relaxed Denim Jeans',
    brand: 'DenimWorks',
    category: 'Jeans',
    price: 99.99,
    description: 'Comfortable relaxed fit jeans constructed with high elastane stretch denim technology.',
    fitType: 'relaxed',
    fabric: '92% Cotton, 6% Polyester, 2% Elastane',
    stretchLevel: 'high',
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChart: {
      S: { waistCm: 80, lengthCm: 102 },
      M: { waistCm: 88, lengthCm: 104 },
      L: { waistCm: 96, lengthCm: 106 },
      XL: { waistCm: 104, lengthCm: 108 }
    },
    availableStock: 75,
    tags: ['relaxed', 'stretch-denim', 'comfortable'],
    brandFitOffsetCm: 1
  },
  {
    name: 'Essential Oversized Graphic Tee',
    brand: 'ApexStudio',
    category: 'T-shirts',
    price: 44.99,
    description: 'Heavyweight organic cotton jersey T-shirt with high-density chest print and dropped shoulder seams.',
    fitType: 'oversized',
    fabric: '100% Organic Heavy Cotton',
    stretchLevel: 'low',
    images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChart: {
      S: { chestCm: 106, shoulderCm: 50, lengthCm: 72, sleeveCm: 22 },
      M: { chestCm: 114, shoulderCm: 53, lengthCm: 75, sleeveCm: 23 },
      L: { chestCm: 122, shoulderCm: 56, lengthCm: 78, sleeveCm: 24 },
      XL: { chestCm: 130, shoulderCm: 59, lengthCm: 81, sleeveCm: 25 }
    },
    availableStock: 110,
    tags: ['graphic-tee', 'oversized', 'streetwear'],
    brandFitOffsetCm: 2
  },
  {
    name: 'Executive Italian Wool Trousers',
    brand: 'HeritageThread',
    category: 'Trousers',
    price: 149.99,
    description: 'Tailored luxury wool blend trousers featuring curtain waistband and crisp front pleats.',
    fitType: 'slim',
    fabric: '90% Virgin Wool, 10% Cashmere',
    stretchLevel: 'none',
    images: ['https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChart: {
      S: { waistCm: 76, lengthCm: 103 },
      M: { waistCm: 82, lengthCm: 105 },
      L: { waistCm: 90, lengthCm: 107 },
      XL: { waistCm: 98, lengthCm: 109 }
    },
    availableStock: 30,
    tags: ['luxury', 'wool', 'tailored'],
    brandFitOffsetCm: -2
  },
  {
    name: 'Breeze Linen Utility Overshirt',
    brand: 'UrbanCraft',
    category: 'Shirts',
    price: 94.99,
    description: 'Dual-chest pocket linen overshirt designed for easy layering during seasonal transitions.',
    fitType: 'relaxed',
    fabric: '100% Linen Blend',
    stretchLevel: 'low',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChart: {
      S: { chestCm: 104, shoulderCm: 47, lengthCm: 73, sleeveCm: 63 },
      M: { chestCm: 112, shoulderCm: 49, lengthCm: 75, sleeveCm: 65 },
      L: { chestCm: 120, shoulderCm: 51, lengthCm: 77, sleeveCm: 66 },
      XL: { chestCm: 128, shoulderCm: 53, lengthCm: 79, sleeveCm: 68 }
    },
    availableStock: 65,
    tags: ['overshirt', 'layering', 'utility'],
    brandFitOffsetCm: 1
  },
  {
    name: 'ProRun Seamless Training Top',
    brand: 'AeroAthletics',
    category: 'T-shirts',
    price: 54.99,
    description: 'Body-mapped seamless mesh panels deliver targeted ventilation and hyper-conforming athletic fit.',
    fitType: 'slim',
    fabric: '90% Nylon, 10% Spandex',
    stretchLevel: 'high',
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChart: {
      S: { chestCm: 88, shoulderCm: 40, lengthCm: 68, sleeveCm: 19 },
      M: { chestCm: 94, shoulderCm: 42, lengthCm: 70, sleeveCm: 20 },
      L: { chestCm: 102, shoulderCm: 44, lengthCm: 72, sleeveCm: 21 },
      XL: { chestCm: 110, shoulderCm: 46, lengthCm: 74, sleeveCm: 22 }
    },
    availableStock: 140,
    tags: ['seamless', 'training', 'compression'],
    brandFitOffsetCm: 0
  },
  {
    name: 'Subtle Minimalist Crewneck Sweatshirt',
    brand: 'ApexStudio',
    category: 'Hoodies',
    price: 79.99,
    description: 'Clean crewneck pullover sweatshirt built with dense loopback cotton terry and ribbed side gussets.',
    fitType: 'regular',
    fabric: '100% Organic Loopback Cotton',
    stretchLevel: 'medium',
    images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChart: {
      S: { chestCm: 100, shoulderCm: 45, lengthCm: 68, sleeveCm: 62 },
      M: { chestCm: 108, shoulderCm: 47, lengthCm: 70, sleeveCm: 64 },
      L: { chestCm: 116, shoulderCm: 49, lengthCm: 72, sleeveCm: 66 },
      XL: { chestCm: 124, shoulderCm: 51, lengthCm: 74, sleeveCm: 68 }
    },
    availableStock: 85,
    tags: ['crewneck', 'minimalist', 'sweatshirt'],
    brandFitOffsetCm: 0
  },
  {
    name: 'Signature Straight-Leg Raw Jeans',
    brand: 'DenimWorks',
    category: 'Jeans',
    price: 109.99,
    description: 'Timeless 5-pocket straight leg jeans crafted from 13.5oz indigo dyed rigid cotton denim.',
    fitType: 'regular',
    fabric: '100% Rigid Cotton Denim',
    stretchLevel: 'none',
    images: ['https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeChart: {
      S: { waistCm: 78, lengthCm: 103 },
      M: { waistCm: 86, lengthCm: 105 },
      L: { waistCm: 94, lengthCm: 107 },
      XL: { waistCm: 102, lengthCm: 109 }
    },
    availableStock: 50,
    tags: ['straight-leg', 'raw-denim', 'classic'],
    brandFitOffsetCm: -1
  }
];

export async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(ENV.MONGODB_URI);
    console.log('Connected to MongoDB.');

    await User.deleteMany({});
    await Product.deleteMany({});
    await Purchase.deleteMany({});
    await FitFeedback.deleteMany({});
    await ExperimentConfig.deleteMany({});

    console.log('Cleared existing collections.');

    const adminSalt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('AdminPass123!', adminSalt);
    const admin = await User.create({
      name: 'AYRIX Lead Admin',
      email: 'admin@ayrix.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
      profile: {
        preferredFit: 'regular',
        usualSizes: { 'T-shirts': 'M', 'Shirts': 'M', 'Jeans': 'M', 'Hoodies': 'L' },
        preferredBrands: ['UrbanCraft', 'AeroAthletics']
      }
    });

    const pm = await User.create({
      name: 'AYRIX Product Manager',
      email: 'pm@ayrix.com',
      passwordHash: adminPasswordHash,
      role: 'product_manager',
      profile: {
        preferredFit: 'regular',
        usualSizes: {},
        preferredBrands: []
      }
    });

    const customerSalt = await bcrypt.genSalt(10);
    const customerPasswordHash = await bcrypt.hash('CustomerPass123!', customerSalt);
    const demoCustomer = await User.create({
      name: 'Ankit Chaudhary',
      email: 'demo@ayrix.com',
      passwordHash: customerPasswordHash,
      role: 'customer',
      profile: {
        heightCm: 178,
        weightKg: 74,
        chestCm: 99,
        waistCm: 82,
        shoulderCm: 45,
        preferredFit: 'regular',
        usualSizes: { 'T-shirts': 'M', 'Shirts': 'M', 'Jeans': 'M', 'Hoodies': 'M', 'Trousers': 'M' },
        preferredBrands: ['AeroAthletics', 'UrbanCraft']
      }
    });

    const customer2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@ayrix.com',
      passwordHash: customerPasswordHash,
      role: 'customer',
      profile: {
        heightCm: 165,
        weightKg: 58,
        chestCm: 88,
        waistCm: 72,
        shoulderCm: 40,
        preferredFit: 'tight',
        usualSizes: { 'T-shirts': 'S', 'Shirts': 'S', 'Jeans': 'S', 'Hoodies': 'S' },
        preferredBrands: ['UrbanCraft', 'HeritageThread']
      }
    });

    console.log(`Created Users: Admin (${admin.email}), PM (${pm.email}), Customer (${demoCustomer.email})`);

    // Create an exponentially larger realistic catalog using the base data
    const finalCatalog: any[] = [...productsData];
    
    // Generate 40 more products based on the 15 base models with variations
    const colors = ['Black', 'Navy', 'Olive', 'Crimson', 'Charcoal', 'White', 'Sand'];
    const modifiers = ['Pro', 'Essential', 'Premium', 'Tech', 'Classic', 'Urban'];
    
    for (let i = 0; i < 40; i++) {
      const baseProduct = productsData[i % productsData.length];
      const color = colors[i % colors.length];
      const modifier = modifiers[i % modifiers.length];
      
      finalCatalog.push({
        ...baseProduct,
        name: `${modifier} ${color} ${baseProduct.name.split(' ').slice(1).join(' ')}`,
        price: Number((baseProduct.price * (0.8 + Math.random() * 0.4)).toFixed(2)),
        availableStock: Math.floor(Math.random() * 200) + 10,
        images: baseProduct.images, // Reusing base image for realistic look
        tags: [...baseProduct.tags, color.toLowerCase(), modifier.toLowerCase()]
      });
    }

    const createdProducts = await Product.insertMany(finalCatalog);
    console.log(`Inserted ${createdProducts.length} total products into catalog.`);

    const p1 = createdProducts[0];
    const p2 = createdProducts[1];
    const p3 = createdProducts[2];
    const p4 = createdProducts[3];

    const pur1 = await Purchase.create({
      userId: demoCustomer._id,
      productId: p1._id,
      sizePurchased: 'M',
      priceAtPurchase: p1.price,
      status: 'retained',
      recommendedSize: 'M',
      confidenceScore: 91,
      returnRiskLevel: 'LOW'
    });

    await FitFeedback.create({
      userId: demoCustomer._id,
      productId: p1._id,
      purchaseId: pur1._id,
      size: 'M',
      status: 'kept',
      comments: 'Fits amazingly well across shoulders and length.'
    });

    const pur2 = await Purchase.create({
      userId: demoCustomer._id,
      productId: p2._id,
      sizePurchased: 'M',
      priceAtPurchase: p2.price,
      status: 'returned',
      recommendedSize: 'M',
      confidenceScore: 78,
      returnRiskLevel: 'MEDIUM'
    });

    await FitFeedback.create({
      userId: demoCustomer._id,
      productId: p2._id,
      purchaseId: pur2._id,
      size: 'M',
      status: 'returned',
      returnReason: 'tight_chest',
      comments: 'Linen has zero stretch and felt restrictive around chest when buttoned up.'
    });

    const pur3 = await Purchase.create({
      userId: customer2._id,
      productId: p3._id,
      sizePurchased: 'S',
      priceAtPurchase: p3.price,
      status: 'retained',
      recommendedSize: 'S',
      confidenceScore: 88,
      returnRiskLevel: 'LOW'
    });

    await FitFeedback.create({
      userId: customer2._id,
      productId: p3._id,
      purchaseId: pur3._id,
      size: 'S',
      status: 'kept',
      comments: 'Cozy oversized look, perfectly matching expected style.'
    });

    const pur4 = await Purchase.create({
      userId: customer2._id,
      productId: p4._id,
      sizePurchased: 'S',
      priceAtPurchase: p4.price,
      status: 'returned',
      recommendedSize: 'S',
      confidenceScore: 72,
      returnRiskLevel: 'HIGH'
    });

    await FitFeedback.create({
      userId: customer2._id,
      productId: p4._id,
      purchaseId: pur4._id,
      size: 'S',
      status: 'returned',
      returnReason: 'too_small',
      comments: 'High rigid denim made waist uncomfortably tight.'
    });

    console.log('Seeded sample purchases and post-purchase fit feedback records.');

    await ExperimentConfig.create([
      {
        key: 'exp_fit_weights_v2',
        name: 'Fit Algorithm Weights V2',
        description: 'A/B test increasing weight of customer post-purchase return history over static body measurements',
        isEnabled: true,
        variant: 'variant_b',
        weights: {
          bodyMeasurementsWeight: 0.35,
          purchaseHistoryWeight: 0.30,
          brandHistoryWeight: 0.15,
          feedbackHistoryWeight: 0.20
        }
      },
      {
        key: 'exp_alternative_products_boost',
        name: 'High Stretch Alternative Product Boost',
        description: 'Promote alternative garments with >5% elastane stretch level when fit return risk is HIGH',
        isEnabled: true,
        variant: 'control',
        weights: {
          bodyMeasurementsWeight: 0.40,
          purchaseHistoryWeight: 0.35,
          brandHistoryWeight: 0.15,
          feedbackHistoryWeight: 0.10
        }
      }
    ]);

    console.log('Seeded experiment configurations.');
    console.log('\n--- SEED COMPLETE ---');
    console.log('Admin Account: admin@ayrix.com / AdminPass123!');
    console.log('Customer Account: demo@ayrix.com / CustomerPass123!\n');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].includes('seed')) {
  seedDatabase();
}
