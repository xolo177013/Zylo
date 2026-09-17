// Populates the database with a demo admin user, a demo customer, and a
// large catalog of sample products spanning every top-level category shown
// in the site's navigation bar (Mobiles, Electronics, Fashion, Home,
// Appliances, Beauty, Toys, Sports, Furniture, Books). Each category has
// at least 10 products so every nav bar button and every home page section
// has enough real, filterable data to display.
// Run with: npm run seed  (from the backend directory)
require('dotenv').config();
const mongoose = require('mongoose');
const slugify = require('slugify');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

const products = [
  // ==================== Mobiles (10) ====================
  {
    title: 'Smartphone X12 Pro (128GB)',
    description: '6.7-inch AMOLED display, 108MP camera, 5000mAh battery, 5G-ready smartphone.',
    brand: 'Nexora', category: 'Mobiles', subCategory: 'Smartphones',
    price: 24999, mrp: 29999, stock: 30,
    images: ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600'],
    specifications: { RAM: '8GB', Storage: '128GB', Display: '6.7" AMOLED' }, isFeatured: true
  },
  {
    title: 'Galaxy Fold Z Flip 5G',
    description: 'Foldable smartphone with dual displays, flagship chipset and 256GB storage.',
    brand: 'Samsang', category: 'Mobiles', subCategory: 'Smartphones',
    price: 89999, mrp: 104999, stock: 12,
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600'],
    specifications: { RAM: '12GB', Storage: '256GB', Display: 'Foldable AMOLED' }, isFeatured: true
  },
  {
    title: 'Ultra Flagship Phone (256GB)',
    description: 'Premium flagship smartphone with titanium frame, triple camera system.',
    brand: 'Appleon', category: 'Mobiles', subCategory: 'Smartphones',
    price: 129999, mrp: 139999, stock: 18,
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600'],
    specifications: { RAM: '8GB', Storage: '256GB', Camera: 'Triple 48MP' }
  },
  {
    title: 'Budget Smartphone Lite 5G',
    description: 'Affordable 5G smartphone with 6.5-inch HD+ display and 5000mAh battery.',
    brand: 'Nexora', category: 'Mobiles', subCategory: 'Smartphones',
    price: 9999, mrp: 13999, stock: 60,
    images: ['https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=600'],
    specifications: { RAM: '4GB', Storage: '64GB', Display: '6.5" HD+' }
  },
  {
    title: 'Smartphone Y20 (64GB)',
    description: 'Reliable everyday smartphone with a large battery and dual camera setup.',
    brand: 'Nexora', category: 'Mobiles', subCategory: 'Smartphones',
    price: 8499, mrp: 11999, stock: 75,
    images: ['https://images.unsplash.com/photo-1571484268051-4c68199f8fb5?w=600'],
    specifications: { RAM: '4GB', Storage: '64GB', Battery: '5000mAh' }
  },
  {
    title: 'Rugged Outdoor Phone 5G',
    description: 'Shockproof and waterproof rugged smartphone built for outdoor use.',
    brand: 'TerraTech', category: 'Mobiles', subCategory: 'Smartphones',
    price: 15999, mrp: 21999, stock: 25,
    images: ['https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600'],
    specifications: { Protection: 'IP68', Battery: '6000mAh' }
  },
  {
    title: 'Wireless Earbuds Pro ANC',
    description: 'True wireless earbuds with active noise cancellation and 24-hour case battery life.',
    brand: 'SoundWave', category: 'Mobiles', subCategory: 'Accessories',
    price: 3499, mrp: 5999, stock: 90,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600'],
    specifications: { Battery: '24 hrs with case', ANC: 'Yes' }
  },
  {
    title: '65W Fast Charger with Cable',
    description: 'Compact GaN fast charger with USB-C cable, compatible with most smartphones.',
    brand: 'ChargeIt', category: 'Mobiles', subCategory: 'Accessories',
    price: 999, mrp: 1799, stock: 150,
    images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600'],
    specifications: { Output: '65W', Connector: 'USB-C' }
  },
  {
    title: 'Phone Case & Tempered Glass Combo',
    description: 'Shockproof phone case bundled with a 9H tempered glass screen protector.',
    brand: 'ChargeIt', category: 'Mobiles', subCategory: 'Accessories',
    price: 399, mrp: 799, stock: 200,
    images: ['https://images.unsplash.com/photo-1601593346740-925612772716?w=600'],
    specifications: { Hardness: '9H Glass', CaseMaterial: 'TPU' }
  },
  {
    title: 'Power Bank 20000mAh',
    description: 'High-capacity power bank with dual USB output and fast charging support.',
    brand: 'ChargeIt', category: 'Mobiles', subCategory: 'Accessories',
    price: 1499, mrp: 2299, stock: 110,
    images: ['https://images.unsplash.com/photo-1609592806596-b43bada2f2f0?w=600'],
    specifications: { Capacity: '20000mAh', Ports: '2x USB-A, 1x USB-C' }
  },

  // ==================== Electronics (10) ====================
  {
    title: 'Wireless Bluetooth Headphones',
    description: 'Over-ear wireless headphones with active noise cancellation and 30-hour battery life.',
    brand: 'SoundWave', category: 'Electronics', subCategory: 'Audio',
    price: 2499, mrp: 3999, stock: 50,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
    specifications: { Color: 'Black', Battery: '30 hours', Connectivity: 'Bluetooth 5.0' }, isFeatured: true
  },
  {
    title: '4K Smart LED TV 55-inch',
    description: 'Ultra HD smart television with built-in streaming apps and voice remote.',
    brand: 'Visio', category: 'Electronics', subCategory: 'Television',
    price: 34999, mrp: 49999, stock: 15,
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600'],
    specifications: { Resolution: '3840x2160', Size: '55 inch', SmartOS: 'Android TV' }, isFeatured: true
  },
  {
    title: 'Gaming Laptop 15.6" RTX Series',
    description: 'High-performance gaming laptop with dedicated GPU, 16GB RAM, and 512GB SSD.',
    brand: 'TechForge', category: 'Electronics', subCategory: 'Laptops',
    price: 74999, mrp: 89999, stock: 20,
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600'],
    specifications: { RAM: '16GB', Storage: '512GB SSD', GPU: 'RTX 3060' }, isFeatured: true
  },
  {
    title: 'Slim Ultrabook 14" Laptop',
    description: 'Lightweight ultrabook with all-day battery life, ideal for work and study.',
    brand: 'TechForge', category: 'Electronics', subCategory: 'Laptops',
    price: 52999, mrp: 61999, stock: 25,
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600'],
    specifications: { RAM: '8GB', Storage: '256GB SSD', Weight: '1.3kg' }
  },
  {
    title: 'DSLR Camera with 18-55mm Lens',
    description: 'Entry-level DSLR camera kit with kit lens, ideal for photography enthusiasts.',
    brand: 'LensPro', category: 'Electronics', subCategory: 'Cameras',
    price: 42999, mrp: 52999, stock: 10,
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600'],
    specifications: { Sensor: '24.1MP APS-C', Lens: '18-55mm' }
  },
  {
    title: 'Smartwatch Series 7 Fitness',
    description: 'Smartwatch with heart-rate tracking, SpO2 monitor, and 10-day battery life.',
    brand: 'PulseFit', category: 'Electronics', subCategory: 'Wearables',
    price: 3999, mrp: 6999, stock: 70,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
    specifications: { Display: 'AMOLED', Battery: '10 days' }
  },
  {
    title: 'Portable Bluetooth Speaker',
    description: 'Waterproof portable speaker with deep bass and 12-hour playtime.',
    brand: 'SoundWave', category: 'Electronics', subCategory: 'Audio',
    price: 1799, mrp: 2999, stock: 65,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'],
    specifications: { Battery: '12 hours', Waterproof: 'IPX7' }
  },
  {
    title: 'Home Theater Soundbar System',
    description: '2.1 channel soundbar with wireless subwoofer for immersive home cinema audio.',
    brand: 'SoundWave', category: 'Electronics', subCategory: 'Audio',
    price: 6999, mrp: 10999, stock: 30,
    images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600'],
    specifications: { Channels: '2.1', Output: '120W' }
  },
  {
    title: 'Wireless Gaming Mouse & Keyboard Combo',
    description: 'RGB backlit gaming keyboard and precision wireless mouse combo.',
    brand: 'TechForge', category: 'Electronics', subCategory: 'Accessories',
    price: 2299, mrp: 3499, stock: 55,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600'],
    specifications: { Connectivity: 'Wireless 2.4GHz', Backlight: 'RGB' }
  },
  {
    title: 'Tablet 10.4" with Stylus',
    description: 'Lightweight tablet with a vivid 10.4-inch display, bundled stylus included.',
    brand: 'Nexora', category: 'Electronics', subCategory: 'Tablets',
    price: 18999, mrp: 24999, stock: 22,
    images: ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600'],
    specifications: { Display: '10.4"', Storage: '128GB', Stylus: 'Included' }
  },

  // ==================== Fashion (10) ====================
  {
    title: "Men's Running Shoes",
    description: 'Lightweight breathable running shoes with cushioned sole for daily training.',
    brand: 'FlexRun', category: 'Fashion', subCategory: 'Footwear',
    price: 1299, mrp: 2199, stock: 100,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
    specifications: { Material: 'Mesh', Sole: 'Rubber' }
  },
  {
    title: "Women's Casual Handbag",
    description: 'Spacious and stylish handbag made from premium vegan leather.',
    brand: 'UrbanStyle', category: 'Fashion', subCategory: 'Bags',
    price: 899, mrp: 1499, stock: 60,
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600'],
    specifications: { Material: 'Vegan Leather', Color: 'Tan' }
  },
  {
    title: "Men's Slim Fit Denim Jacket",
    description: 'Classic slim-fit denim jacket, perfect for layering in any season.',
    brand: 'UrbanStyle', category: 'Fashion', subCategory: 'Clothing',
    price: 1599, mrp: 2499, stock: 45,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'],
    specifications: { Material: 'Denim', Fit: 'Slim' }, isFeatured: true
  },
  {
    title: "Women's Floral Summer Dress",
    description: 'Breathable cotton-blend floral dress, perfect for warm-weather outings.',
    brand: 'BloomWear', category: 'Fashion', subCategory: 'Clothing',
    price: 1199, mrp: 1999, stock: 55,
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600'],
    specifications: { Material: 'Cotton Blend', Length: 'Midi' }
  },
  {
    title: 'Unisex Aviator Sunglasses',
    description: 'UV-protected aviator sunglasses with a durable metal frame.',
    brand: 'UrbanStyle', category: 'Fashion', subCategory: 'Accessories',
    price: 499, mrp: 999, stock: 120,
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600'],
    specifications: { UVProtection: 'UV400', Frame: 'Metal' }
  },
  {
    title: 'Formal Leather Belt',
    description: 'Genuine leather formal belt with a classic metal buckle.',
    brand: 'FlexRun', category: 'Fashion', subCategory: 'Accessories',
    price: 399, mrp: 799, stock: 90,
    images: ['https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600'],
    specifications: { Material: 'Genuine Leather' }
  },
  {
    title: "Women's Ethnic Kurta Set",
    description: 'Printed cotton kurta with matching palazzo pants and dupatta.',
    brand: 'BloomWear', category: 'Fashion', subCategory: 'Clothing',
    price: 1099, mrp: 1899, stock: 65,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'],
    specifications: { Material: 'Cotton', Pieces: '3-piece set' }, isFeatured: true
  },
  {
    title: "Men's Cotton Formal Shirt",
    description: 'Wrinkle-resistant formal shirt, tailored slim fit, ideal for office wear.',
    brand: 'UrbanStyle', category: 'Fashion', subCategory: 'Clothing',
    price: 799, mrp: 1399, stock: 85,
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600'],
    specifications: { Material: 'Cotton', Fit: 'Slim' }
  },
  {
    title: "Women's Block Heel Sandals",
    description: 'Comfortable block heel sandals with a cushioned footbed for all-day wear.',
    brand: 'BloomWear', category: 'Fashion', subCategory: 'Footwear',
    price: 899, mrp: 1499, stock: 70,
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600'],
    specifications: { HeelHeight: '2 inch', Material: 'Synthetic' }
  },
  {
    title: "Men's Sports Sneakers",
    description: 'Everyday sneakers with a knit upper and lightweight cushioned sole.',
    brand: 'FlexRun', category: 'Fashion', subCategory: 'Footwear',
    price: 1499, mrp: 2499, stock: 80,
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600'],
    specifications: { Material: 'Knit', Sole: 'EVA' }
  },

  // ==================== Home (10) ====================
  {
    title: 'Stainless Steel Cookware Set (5 pcs)',
    description: 'Durable stainless steel cookware set including pots and pans, induction compatible.',
    brand: 'HomeChef', category: 'Home', subCategory: 'Cookware',
    price: 1899, mrp: 2999, stock: 40,
    images: ['https://images.unsplash.com/photo-1584990347449-a5d9e0a4f9a3?w=600'],
    specifications: { Material: 'Stainless Steel', Pieces: '5' }
  },
  {
    title: 'Cotton Bedsheet Set (Queen Size)',
    description: 'Soft 300-thread-count cotton bedsheet set with two matching pillow covers.',
    brand: 'HomeWeave', category: 'Home', subCategory: 'Bedding',
    price: 999, mrp: 1799, stock: 75,
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600'],
    specifications: { Material: '100% Cotton', ThreadCount: '300' }, isFeatured: true
  },
  {
    title: 'Decorative Wall Clock',
    description: 'Minimalist silent-sweep wall clock, ideal for living rooms and offices.',
    brand: 'HomeWeave', category: 'Home', subCategory: 'Decor',
    price: 599, mrp: 999, stock: 85,
    images: ['https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600'],
    specifications: { Diameter: '30cm', Mechanism: 'Silent Sweep' }
  },
  {
    title: 'Scented Candle Gift Set (Set of 4)',
    description: 'Long-lasting soy wax scented candles in vanilla, lavender, citrus, and sandalwood.',
    brand: 'HomeWeave', category: 'Home', subCategory: 'Decor',
    price: 799, mrp: 1299, stock: 100,
    images: ['https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=600'],
    specifications: { Wax: 'Soy', BurnTime: '20 hrs each' }
  },
  {
    title: 'Memory Foam Bath Mat Set (2 pcs)',
    description: 'Super-absorbent, non-slip memory foam bath mats for bathroom comfort.',
    brand: 'HomeWeave', category: 'Home', subCategory: 'Bath',
    price: 549, mrp: 899, stock: 65,
    images: ['https://images.unsplash.com/photo-1600166898405-da9535204843?w=600'],
    specifications: { Material: 'Memory Foam', Pieces: '2' }
  },
  {
    title: 'Wooden Photo Frame Set (Set of 6)',
    description: 'Assorted wooden picture frames for creating a personalized gallery wall.',
    brand: 'HomeWeave', category: 'Home', subCategory: 'Decor',
    price: 699, mrp: 1199, stock: 90,
    images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600'],
    specifications: { Material: 'Wood', Pieces: '6' }
  },
  {
    title: 'LED String Lights (10m)',
    description: 'Warm white LED fairy lights, ideal for festive decor and home ambience.',
    brand: 'HomeWeave', category: 'Home', subCategory: 'Decor',
    price: 349, mrp: 599, stock: 130,
    images: ['https://images.unsplash.com/photo-1482443462559-8e42210b1027?w=600'],
    specifications: { Length: '10m', Color: 'Warm White' }
  },
  {
    title: 'Ceramic Dinner Set (16 pcs)',
    description: 'Elegant ceramic dinnerware set for 4, microwave and dishwasher safe.',
    brand: 'HomeChef', category: 'Home', subCategory: 'Dining',
    price: 1499, mrp: 2499, stock: 45,
    images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600'],
    specifications: { Material: 'Ceramic', Pieces: '16', ServesUpTo: '4' }, isFeatured: true
  },
  {
    title: 'Blackout Curtains (Pack of 2)',
    description: 'Thermal-insulated blackout curtains that block light and reduce noise.',
    brand: 'HomeWeave', category: 'Home', subCategory: 'Furnishing',
    price: 899, mrp: 1599, stock: 70,
    images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600'],
    specifications: { Material: 'Polyester', Pieces: '2' }
  },
  {
    title: 'Storage Organizer Boxes (Set of 3)',
    description: 'Foldable fabric storage bins for closets, shelves, and wardrobes.',
    brand: 'HomeWeave', category: 'Home', subCategory: 'Storage',
    price: 599, mrp: 999, stock: 95,
    images: ['https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=600'],
    specifications: { Material: 'Non-woven Fabric', Pieces: '3' }
  },

  // ==================== Appliances (10) ====================
  {
    title: 'Electric Kettle 1.8L',
    description: 'Fast-boil electric kettle with auto shut-off and stainless steel body.',
    brand: 'HomeChef', category: 'Appliances', subCategory: 'Kitchen Appliances',
    price: 799, mrp: 1299, stock: 55,
    images: ['https://images.unsplash.com/photo-1594213240043-1b0754b3e3f5?w=600'],
    specifications: { Capacity: '1.8L', Power: '1500W' }
  },
  {
    title: 'Front Load Washing Machine 7kg',
    description: 'Fully automatic front-load washing machine with 12 wash programs.',
    brand: 'Visio', category: 'Appliances', subCategory: 'Laundry',
    price: 26999, mrp: 33999, stock: 12,
    images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600'],
    specifications: { Capacity: '7kg', Type: 'Front Load' }, isFeatured: true
  },
  {
    title: 'Double Door Refrigerator 260L',
    description: 'Frost-free double door refrigerator with a spacious vegetable crisper.',
    brand: 'Visio', category: 'Appliances', subCategory: 'Refrigerators',
    price: 24999, mrp: 29999, stock: 14,
    images: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600'],
    specifications: { Capacity: '260L', Type: 'Frost Free' }
  },
  {
    title: 'Microwave Oven with Grill 23L',
    description: 'Convection microwave oven with grill function and auto-cook menus.',
    brand: 'HomeChef', category: 'Appliances', subCategory: 'Kitchen Appliances',
    price: 8999, mrp: 11999, stock: 20,
    images: ['https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600'],
    specifications: { Capacity: '23L', Function: 'Grill + Convection' }
  },
  {
    title: 'Robot Vacuum Cleaner',
    description: 'Smart robot vacuum with app control, auto-charging, and strong suction.',
    brand: 'CleanBot', category: 'Appliances', subCategory: 'Home Care',
    price: 14999, mrp: 19999, stock: 18,
    images: ['https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=600'],
    specifications: { Suction: '2200Pa', Control: 'App + Voice' }
  },
  {
    title: 'Air Fryer 4.5L',
    description: 'Oil-free air fryer with digital touch panel and 8 pre-set cooking modes.',
    brand: 'HomeChef', category: 'Appliances', subCategory: 'Kitchen Appliances',
    price: 4999, mrp: 7499, stock: 40,
    images: ['https://images.unsplash.com/photo-1648223846297-dd1006ff3ea9?w=600'],
    specifications: { Capacity: '4.5L', Presets: '8' }, isFeatured: true
  },
  {
    title: 'Mixer Grinder 750W',
    description: '3-jar mixer grinder with powerful motor for all your kitchen prep needs.',
    brand: 'HomeChef', category: 'Appliances', subCategory: 'Kitchen Appliances',
    price: 2499, mrp: 3999, stock: 60,
    images: ['https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=601'],
    specifications: { Power: '750W', Jars: '3' }
  },
  {
    title: 'Room Air Cooler 40L',
    description: 'High-efficiency air cooler with honeycomb cooling pads for large rooms.',
    brand: 'CoolBreeze', category: 'Appliances', subCategory: 'Cooling',
    price: 7499, mrp: 10999, stock: 25,
    images: ['https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=600'],
    specifications: { TankCapacity: '40L', CoolingPads: 'Honeycomb' }
  },
  {
    title: 'Water Purifier RO+UV',
    description: '7-stage RO+UV water purifier with mineral cartridge for safe drinking water.',
    brand: 'PureFlow', category: 'Appliances', subCategory: 'Home Care',
    price: 8999, mrp: 12999, stock: 30,
    images: ['https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600'],
    specifications: { Stages: '7', Technology: 'RO + UV' }
  },
  {
    title: 'Ceiling Fan 1200mm',
    description: 'Energy-efficient ceiling fan with high air delivery and rust-proof finish.',
    brand: 'CoolBreeze', category: 'Appliances', subCategory: 'Cooling',
    price: 1499, mrp: 2299, stock: 80,
    images: ['https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c6?w=600'],
    specifications: { Sweep: '1200mm', Speed: '380 RPM' }
  },

  // ==================== Beauty (10) ====================
  {
    title: 'Vitamin C Face Serum',
    description: 'Brightening vitamin C serum for even skin tone and radiant glow.',
    brand: 'GlowLab', category: 'Beauty', subCategory: 'Skincare',
    price: 599, mrp: 999, stock: 130,
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'],
    specifications: { Volume: '30ml', SkinType: 'All' }, isFeatured: true
  },
  {
    title: 'Matte Lipstick Combo (Set of 3)',
    description: 'Long-lasting matte lipstick set in three everyday shades.',
    brand: 'ColorPop', category: 'Beauty', subCategory: 'Makeup',
    price: 449, mrp: 799, stock: 110,
    images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600'],
    specifications: { Finish: 'Matte', Pieces: '3' }
  },
  {
    title: 'Professional Hair Dryer 2000W',
    description: 'Fast-drying hair dryer with multiple heat settings and cool shot button.',
    brand: 'StyleTech', category: 'Beauty', subCategory: 'Hair Care',
    price: 1299, mrp: 2199, stock: 60,
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600'],
    specifications: { Power: '2000W', Settings: '3 heat / 2 speed' }
  },
  {
    title: "Men's Grooming Kit",
    description: 'Complete trimmer and grooming kit with multiple attachments.',
    brand: 'StyleTech', category: 'Beauty', subCategory: 'Grooming',
    price: 999, mrp: 1699, stock: 75,
    images: ['https://images.unsplash.com/photo-1621607512214-68297480165e?w=600'],
    specifications: { Battery: 'Rechargeable', Attachments: '6' }
  },
  {
    title: 'Herbal Shampoo & Conditioner Set',
    description: 'Sulfate-free herbal shampoo and conditioner duo for nourished hair.',
    brand: 'GlowLab', category: 'Beauty', subCategory: 'Hair Care',
    price: 549, mrp: 899, stock: 95,
    images: ['https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=600'],
    specifications: { Volume: '2x300ml', SulfateFree: 'Yes' }
  },
  {
    title: 'Sunscreen SPF 50 PA+++',
    description: 'Lightweight, non-greasy sunscreen lotion with broad-spectrum protection.',
    brand: 'GlowLab', category: 'Beauty', subCategory: 'Skincare',
    price: 399, mrp: 649, stock: 140,
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'],
    specifications: { SPF: '50', Volume: '50ml' }, isFeatured: true
  },
  {
    title: 'Perfume Gift Set (Set of 2)',
    description: 'Long-lasting eau de parfum duo, one floral and one woody fragrance.',
    brand: 'ColorPop', category: 'Beauty', subCategory: 'Fragrance',
    price: 1299, mrp: 2199, stock: 55,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=600'],
    specifications: { Volume: '2x50ml', Type: 'Eau de Parfum' }
  },
  {
    title: 'Facial Cleansing Brush',
    description: 'Silicone facial cleansing brush with multiple speed settings for deep cleansing.',
    brand: 'GlowLab', category: 'Beauty', subCategory: 'Skincare',
    price: 899, mrp: 1499, stock: 70,
    images: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600'],
    specifications: { Material: 'Silicone', Waterproof: 'Yes' }
  },
  {
    title: 'Nail Art Kit',
    description: 'Complete nail art kit with polishes, stickers, and design tools.',
    brand: 'ColorPop', category: 'Beauty', subCategory: 'Makeup',
    price: 349, mrp: 599, stock: 100,
    images: ['https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600'],
    specifications: { Pieces: '20+', SkinType: 'All' }
  },
  {
    title: 'Hair Straightener Ceramic Plates',
    description: 'Ceramic-coated hair straightener for smooth, frizz-free styling.',
    brand: 'StyleTech', category: 'Beauty', subCategory: 'Hair Care',
    price: 999, mrp: 1799, stock: 65,
    images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600'],
    specifications: { Plates: 'Ceramic', Temperature: 'Up to 200°C' }
  },

  // ==================== Toys (10) ====================
  {
    title: 'Building Blocks Set (300 pcs)',
    description: 'Creative building block set compatible with major brands, boosts creativity.',
    brand: 'PlayBig', category: 'Toys', subCategory: 'Building',
    price: 799, mrp: 1299, stock: 80,
    images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600'],
    specifications: { Pieces: '300', AgeGroup: '5+ years' }, isFeatured: true
  },
  {
    title: 'Remote Control Racing Car',
    description: 'High-speed RC car with rechargeable battery and full directional control.',
    brand: 'PlayBig', category: 'Toys', subCategory: 'RC Toys',
    price: 1499, mrp: 2499, stock: 50,
    images: ['https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600'],
    specifications: { Speed: '15 km/h', Battery: 'Rechargeable' }
  },
  {
    title: 'Educational Puzzle Set (Pack of 5)',
    description: 'Jigsaw puzzles designed to build problem-solving skills in young children.',
    brand: 'BrightMinds', category: 'Toys', subCategory: 'Educational',
    price: 399, mrp: 699, stock: 100,
    images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746c?w=600'],
    specifications: { Pieces: '5 puzzles', AgeGroup: '3-8 years' }
  },
  {
    title: 'Soft Plush Teddy Bear (24 inch)',
    description: 'Extra-large huggable teddy bear made from soft, safe plush material.',
    brand: 'CuddleCo', category: 'Toys', subCategory: 'Soft Toys',
    price: 899, mrp: 1499, stock: 70,
    images: ['https://images.unsplash.com/photo-1559454403-b8fb88521f22?w=600'],
    specifications: { Height: '24 inch', Material: 'Plush' }
  },
  {
    title: "Kids' Art & Craft Kit",
    description: 'All-in-one art and craft kit with crayons, paints, and paper for creative play.',
    brand: 'BrightMinds', category: 'Toys', subCategory: 'Educational',
    price: 599, mrp: 999, stock: 90,
    images: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600'],
    specifications: { Pieces: '50+', AgeGroup: '4+ years' }
  },
  {
    title: 'Battery Operated Robot Toy',
    description: 'Walking, talking robot toy with lights and sound effects for imaginative play.',
    brand: 'PlayBig', category: 'Toys', subCategory: 'Electronic Toys',
    price: 999, mrp: 1699, stock: 60,
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=600'],
    specifications: { Battery: 'AA (3x)', AgeGroup: '4+ years' }
  },
  {
    title: "Kids' Play Kitchen Set",
    description: 'Pretend-play kitchen set with utensils and accessories for imaginative fun.',
    brand: 'CuddleCo', category: 'Toys', subCategory: 'Pretend Play',
    price: 1799, mrp: 2799, stock: 35,
    images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746d?w=600'],
    specifications: { Material: 'BPA-free Plastic', AgeGroup: '3+ years' }, isFeatured: true
  },
  {
    title: 'Wooden Building Blocks (Eco)',
    description: 'Eco-friendly wooden blocks in assorted shapes, safe for toddlers.',
    brand: 'BrightMinds', category: 'Toys', subCategory: 'Building',
    price: 699, mrp: 1199, stock: 85,
    images: ['https://images.unsplash.com/photo-1560859251-d563a49c5e56?w=600'],
    specifications: { Material: 'Wood', Pieces: '40' }
  },
  {
    title: 'Action Figure Collectible Set',
    description: 'Set of poseable action figures with accessories for collectors and kids alike.',
    brand: 'PlayBig', category: 'Toys', subCategory: 'Action Figures',
    price: 1199, mrp: 1999, stock: 55,
    images: ['https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=600'],
    specifications: { Pieces: '4 figures', AgeGroup: '6+ years' }
  },
  {
    title: "Kids' Ride-On Scooter",
    description: '3-wheel ride-on scooter with adjustable height and LED front wheel.',
    brand: 'PlayBig', category: 'Toys', subCategory: 'Outdoor',
    price: 1999, mrp: 2999, stock: 40,
    images: ['https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600'],
    specifications: { Wheels: '3', AgeGroup: '3-8 years' }
  },

  // ==================== Sports (10) ====================
  {
    title: 'Yoga Mat with Carry Strap',
    description: 'Non-slip eco-friendly yoga mat, 6mm thick, includes carrying strap.',
    brand: 'ZenFit', category: 'Sports', subCategory: 'Fitness',
    price: 599, mrp: 999, stock: 80,
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600'],
    specifications: { Thickness: '6mm', Material: 'Eco Foam' }
  },
  {
    title: 'Adjustable Dumbbell Set (20kg)',
    description: 'Space-saving adjustable dumbbell pair for home strength training.',
    brand: 'ZenFit', category: 'Sports', subCategory: 'Fitness',
    price: 2999, mrp: 4499, stock: 35,
    images: ['https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=600'],
    specifications: { Weight: '20kg total', Adjustable: 'Yes' }, isFeatured: true
  },
  {
    title: 'Cricket Bat - Professional Grade',
    description: 'English willow cricket bat, professional grade for serious players.',
    brand: 'SportKing', category: 'Sports', subCategory: 'Cricket',
    price: 3499, mrp: 5499, stock: 25,
    images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600'],
    specifications: { Material: 'English Willow', Weight: '1180g' }
  },
  {
    title: 'Badminton Racket Set (Pair)',
    description: 'Lightweight badminton racket pair with cover, includes shuttlecocks.',
    brand: 'SportKing', category: 'Sports', subCategory: 'Badminton',
    price: 999, mrp: 1699, stock: 60,
    images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600'],
    specifications: { Pieces: '2 rackets + 3 shuttles', Material: 'Aluminum' }
  },
  {
    title: 'Football - Size 5',
    description: 'Match-quality size 5 football with a durable synthetic leather cover.',
    brand: 'SportKing', category: 'Sports', subCategory: 'Football',
    price: 799, mrp: 1299, stock: 90,
    images: ['https://images.unsplash.com/photo-1614632537190-23e4146777db?w=600'],
    specifications: { Size: '5', Material: 'Synthetic Leather' }
  },
  {
    title: 'Skipping Rope with Counter',
    description: 'Adjustable skipping rope with a built-in digital jump counter.',
    brand: 'ZenFit', category: 'Sports', subCategory: 'Fitness',
    price: 349, mrp: 599, stock: 120,
    images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600'],
    specifications: { Length: 'Adjustable', Counter: 'Digital' }
  },
  {
    title: 'Cycling Helmet',
    description: 'Ventilated, lightweight cycling helmet with adjustable fit dial.',
    brand: 'SportKing', category: 'Sports', subCategory: 'Cycling',
    price: 1299, mrp: 2199, stock: 45,
    images: ['https://images.unsplash.com/photo-1557687284-1471c0e2ff65?w=600'],
    specifications: { Vents: '18', FitSystem: 'Dial Adjust' }
  },
  {
    title: 'Resistance Bands Set (5 pcs)',
    description: 'Set of 5 resistance bands with varying tension levels for home workouts.',
    brand: 'ZenFit', category: 'Sports', subCategory: 'Fitness',
    price: 499, mrp: 899, stock: 100,
    images: ['https://images.unsplash.com/photo-1598971639058-fab3c3109a34?w=600'],
    specifications: { Pieces: '5', Material: 'Natural Latex' }, isFeatured: true
  },
  {
    title: 'Table Tennis Racket Set',
    description: 'Pair of table tennis rackets with 3 balls and a carry case.',
    brand: 'SportKing', category: 'Sports', subCategory: 'Table Tennis',
    price: 699, mrp: 1199, stock: 70,
    images: ['https://images.unsplash.com/photo-1534158914592-062992fbe900?w=600'],
    specifications: { Pieces: '2 rackets + 3 balls' }
  },
  {
    title: 'Sports Water Bottle (1L)',
    description: 'Leak-proof, BPA-free sports water bottle with a flip-top straw lid.',
    brand: 'ZenFit', category: 'Sports', subCategory: 'Accessories',
    price: 299, mrp: 499, stock: 150,
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600'],
    specifications: { Capacity: '1L', Material: 'BPA-free Plastic' }
  },

  // ==================== Furniture (10) ====================
  {
    title: '3-Seater Fabric Sofa',
    description: 'Comfortable 3-seater sofa with premium fabric upholstery and wooden frame.',
    brand: 'WoodCraft', category: 'Furniture', subCategory: 'Living Room',
    price: 18999, mrp: 27999, stock: 10,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'],
    specifications: { Seating: '3 Seater', Material: 'Fabric + Wood' }, isFeatured: true
  },
  {
    title: 'Study Table with Bookshelf',
    description: 'Compact study table with an attached bookshelf, ideal for home offices.',
    brand: 'WoodCraft', category: 'Furniture', subCategory: 'Office',
    price: 4999, mrp: 7499, stock: 25,
    images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600'],
    specifications: { Material: 'Engineered Wood', Shelves: '3' }
  },
  {
    title: 'Queen Size Bed with Storage',
    description: 'Solid wood queen-size bed frame with hydraulic storage underneath.',
    brand: 'WoodCraft', category: 'Furniture', subCategory: 'Bedroom',
    price: 22999, mrp: 31999, stock: 8,
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600'],
    specifications: { Size: 'Queen', Storage: 'Hydraulic' }
  },
  {
    title: 'Ergonomic Office Chair',
    description: 'Adjustable ergonomic office chair with lumbar support and breathable mesh back.',
    brand: 'WoodCraft', category: 'Furniture', subCategory: 'Office',
    price: 6999, mrp: 10999, stock: 30,
    images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600'],
    specifications: { Material: 'Mesh', Adjustable: 'Height + Recline' }
  },
  {
    title: 'Wooden Dining Table Set (4-seater)',
    description: 'Solid wood dining table with 4 cushioned chairs, seats a family of four.',
    brand: 'WoodCraft', category: 'Furniture', subCategory: 'Dining',
    price: 15999, mrp: 22999, stock: 12,
    images: ['https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=600'],
    specifications: { Seating: '4', Material: 'Solid Wood' }, isFeatured: true
  },
  {
    title: 'TV Entertainment Unit',
    description: 'Modern TV unit with storage cabinets, fits TVs up to 55 inches.',
    brand: 'WoodCraft', category: 'Furniture', subCategory: 'Living Room',
    price: 5999, mrp: 8999, stock: 20,
    images: ['https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600'],
    specifications: { MaxTVSize: '55 inch', Material: 'Engineered Wood' }
  },
  {
    title: 'Bean Bag Chair (XXL)',
    description: 'Extra-large fabric bean bag filled with premium beans for cozy seating.',
    brand: 'WoodCraft', category: 'Furniture', subCategory: 'Living Room',
    price: 1999, mrp: 3299, stock: 40,
    images: ['https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600'],
    specifications: { Size: 'XXL', Fill: 'EPS Beans' }
  },
  {
    title: 'Shoe Rack with Cabinet',
    description: 'Multi-layer shoe rack with a closed cabinet, holds up to 18 pairs.',
    brand: 'WoodCraft', category: 'Furniture', subCategory: 'Storage',
    price: 3499, mrp: 5499, stock: 35,
    images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600'],
    specifications: { Capacity: '18 pairs', Material: 'Engineered Wood' }
  },
  {
    title: 'Bookshelf 5-Tier',
    description: 'Freestanding 5-tier bookshelf with a sturdy metal frame and wood shelves.',
    brand: 'WoodCraft', category: 'Furniture', subCategory: 'Storage',
    price: 3999, mrp: 6499, stock: 28,
    images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600'],
    specifications: { Tiers: '5', Material: 'Metal + Wood' }
  },
  {
    title: 'Wardrobe 3-Door',
    description: 'Spacious 3-door wardrobe with hanging space, shelves, and a mirror.',
    brand: 'WoodCraft', category: 'Furniture', subCategory: 'Bedroom',
    price: 16999, mrp: 23999, stock: 10,
    images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d3?w=600'],
    specifications: { Doors: '3', Mirror: 'Yes' }
  },

  // ==================== Books (10) ====================
  {
    title: "Kids' Story Book Collection (Set of 10)",
    description: 'A collection of 10 illustrated story books for children aged 4-8.',
    brand: 'ReadRight', category: 'Books', subCategory: 'Children',
    price: 499, mrp: 799, stock: 70,
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'],
    specifications: { Pages: '240 total', AgeGroup: '4-8 years' }
  },
  {
    title: 'The Art of Programming - Paperback',
    description: 'A beginner-friendly guide to programming fundamentals and problem solving.',
    brand: 'ReadRight', category: 'Books', subCategory: 'Technology',
    price: 699, mrp: 1099, stock: 55,
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'],
    specifications: { Pages: '412', Format: 'Paperback' }, isFeatured: true
  },
  {
    title: 'Bestselling Fiction Novel',
    description: 'An award-winning fiction novel that topped bestseller charts worldwide.',
    brand: 'ReadRight', category: 'Books', subCategory: 'Fiction',
    price: 349, mrp: 599, stock: 90,
    images: ['https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600'],
    specifications: { Pages: '368', Format: 'Paperback' }
  },
  {
    title: 'Personal Finance & Investing Guide',
    description: 'A practical guide to budgeting, saving, and building long-term wealth.',
    brand: 'ReadRight', category: 'Books', subCategory: 'Non-Fiction',
    price: 449, mrp: 799, stock: 65,
    images: ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600'],
    specifications: { Pages: '288', Format: 'Paperback' }
  },
  {
    title: 'Self-Help & Motivation Book',
    description: 'A practical, research-backed guide to building better habits and mindset.',
    brand: 'ReadRight', category: 'Books', subCategory: 'Non-Fiction',
    price: 399, mrp: 699, stock: 80,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'],
    specifications: { Pages: '256', Format: 'Paperback' }
  },
  {
    title: 'History of the World - Hardcover',
    description: 'An illustrated hardcover chronicle of major events across world history.',
    brand: 'ReadRight', category: 'Books', subCategory: 'Non-Fiction',
    price: 899, mrp: 1499, stock: 30,
    images: ['https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600'],
    specifications: { Pages: '520', Format: 'Hardcover' }, isFeatured: true
  },
  {
    title: 'Cookbook: Everyday Recipes',
    description: 'A collection of 100+ easy, everyday recipes for home cooks of all levels.',
    brand: 'ReadRight', category: 'Books', subCategory: 'Cooking',
    price: 549, mrp: 899, stock: 60,
    images: ['https://images.unsplash.com/photo-1589998059171-988d887df646?w=600'],
    specifications: { Pages: '300', Recipes: '100+' }
  },
  {
    title: 'Comic Book Collection (Set of 5)',
    description: 'A set of 5 action-packed comic books, great for young readers and collectors.',
    brand: 'ReadRight', category: 'Books', subCategory: 'Comics',
    price: 599, mrp: 999, stock: 75,
    images: ['https://images.unsplash.com/photo-1601513237763-70dabc7ae752?w=600'],
    specifications: { Pieces: '5', AgeGroup: '8+ years' }
  },
  {
    title: 'Competitive Exam Guide',
    description: 'Comprehensive preparation guide covering reasoning, math, and general knowledge.',
    brand: 'ReadRight', category: 'Books', subCategory: 'Education',
    price: 649, mrp: 1099, stock: 50,
    images: ['https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600'],
    specifications: { Pages: '600', Format: 'Paperback' }
  },
  {
    title: 'Poetry Anthology',
    description: 'A curated anthology of classic and contemporary poems from around the world.',
    brand: 'ReadRight', category: 'Books', subCategory: 'Fiction',
    price: 399, mrp: 649, stock: 55,
    images: ['https://images.unsplash.com/photo-1526243741027-444d633d7365?w=600'],
    specifications: { Pages: '220', Format: 'Paperback' }
  }
];

const seedData = async () => {
  try {
    console.log('=== seed.js v2 (slug-fix version) ===');
    await connectDB();

    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({})
    ]);

    console.log('Creating demo users...');
    await User.create({
      name: 'Admin User',
      email: 'admin@zylo.test',
      password: 'admin123',
      role: 'admin'
    });

    await User.create({
      name: 'Demo Customer',
      email: 'customer@zylo.test',
      password: 'customer123',
      role: 'customer'
    });

    const categoryCount = new Set(products.map((p) => p.category)).size;
    console.log(`Creating ${products.length} demo products across ${categoryCount} categories...`);

    // insertMany() does NOT run Mongoose's pre('save') hooks, so the
    // slug/discountPercent auto-generation on the Product model never
    // fires here. Without this, every product would get slug: null and
    // the unique index on `slug` would reject every product after the
    // first. Generate both fields explicitly before inserting.
    const productsToInsert = products.map((p, idx) => ({
      ...p,
      slug: `${slugify(p.title, { lower: true, strict: true })}-${idx}-${Date.now().toString(36)}`,
      discountPercent: p.mrp > 0 ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0
    }));

    await Product.insertMany(productsToInsert);

    console.log('Seed complete!');
    console.log('Admin login    -> admin@zylo.test / admin123');
    console.log('Customer login -> customer@zylo.test / customer123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
