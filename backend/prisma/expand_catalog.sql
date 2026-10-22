-- Expanded Seed Data for Nirmaan Platform: Vendors, Manufacturers, Categories & Products

-- 1. Create Additional Vendors & Manufacturers
INSERT INTO "users" ("id", "email", "passwordHash", "name", "companyName", "role", "isVerified", "updatedAt")
VALUES 
  ('usr-mfr-4', 'kundan@heritagecrafts.in', '$2a$10$w0M8c1aKz1WqK2Cqv0sKkOHfTqJ4bO7O6hO3pXf0p/lH5jN8jI07a', 'Vikramaditya Rathore', 'Heritage Kundan & Polki Works', 'MANUFACTURER', true, NOW()),
  ('usr-mfr-5', 'chains@shreejimfg.com', '$2a$10$w0M8c1aKz1WqK2Cqv0sKkOHfTqJ4bO7O6hO3pXf0p/lH5jN8jI07a', 'Bhavik Shah', 'Shreeji Precision Chains & Findings', 'MANUFACTURER', true, NOW()),
  ('usr-mfr-6', 'pearls@coastaljewels.com', '$2a$10$w0M8c1aKz1WqK2Cqv0sKkOHfTqJ4bO7O6hO3pXf0p/lH5jN8jI07a', 'Ananya Sen', 'Coastal Pearl & Bead Labs', 'MANUFACTURER', true, NOW()),
  ('usr-mfr-7', 'luxury@auraecopack.com', '$2a$10$w0M8c1aKz1WqK2Cqv0sKkOHfTqJ4bO7O6hO3pXf0p/lH5jN8jI07a', 'Deepak Verma', 'Aura Eco-Packaging Solutions', 'MANUFACTURER', true, NOW()),
  ('usr-mfr-8', 'casting@titaniumcraft.in', '$2a$10$w0M8c1aKz1WqK2Cqv0sKkOHfTqJ4bO7O6hO3pXf0p/lH5jN8jI07a', 'Sanjay Hegde', 'Titanium & Stainless Studio', 'MANUFACTURER', true, NOW())
ON CONFLICT ("id") DO NOTHING;

-- 2. Create Manufacturer Profiles
INSERT INTO "manufacturer_profiles" ("id", "userId", "factoryName", "city", "country", "verificationStatus", "rating", "reviewCount", "productionCapacity", "minOrderQuantity", "certifications", "updatedAt")
VALUES 
  ('mp-4', 'usr-mfr-4', 'Heritage Kundan Workshop', 'Jaipur', 'India', 'VERIFIED', 4.9, 38, '3000 pcs/month', 25, '["Jaipur Crafts Guild", "Hallmark Certified", "ISO 9001"]', NOW()),
  ('mp-5', 'usr-mfr-5', 'Shreeji Chain Unit #2', 'Rajkot', 'India', 'VERIFIED', 4.7, 45, '25000 meters/month', 50, '["BIS Hallmark", "ISO 14001"]', NOW()),
  ('mp-6', 'usr-mfr-6', 'Coastal Cultured Unit', 'Hyderabad', 'India', 'VERIFIED', 4.8, 19, '8000 pcs/month', 30, '["Gemmological Institute Certified"]', NOW()),
  ('mp-7', 'usr-mfr-7', 'Aura Paper & Box Mills', 'Greater Noida', 'India', 'VERIFIED', 4.9, 52, '50000 boxes/month', 100, '["FSC Certified", "Eco-Friendly Recyclable"]', NOW()),
  ('mp-8', 'usr-mfr-8', 'Titanium Castings Tech', 'Bengaluru', 'India', 'VERIFIED', 4.6, 17, '12000 pcs/month', 50, '["RoHS Compliant", "Hypoallergenic Certified"]', NOW())
ON CONFLICT ("id") DO NOTHING;

-- 3. Add Extra Categories
INSERT INTO "categories" ("id", "name", "slug", "description")
VALUES 
  ('cat-5', 'Bracelets & Bangles', 'bracelets', 'Cuffs, tennis bracelets, charm bracelets and Kada'),
  ('cat-6', 'Chains & Findings', 'chains-findings', 'Snake chains, curb chains, clasps and jump rings'),
  ('cat-7', 'Kundan & Bridal', 'kundan-bridal', 'Traditional bridal sets, maang tikka and chokers'),
  ('cat-8', 'Waterproof Everyday', 'waterproof-everyday', 'Sweatproof and waterproof stainless steel PVD gold jewellery')
ON CONFLICT ("id") DO NOTHING;

-- 4. Insert 16 New Diverse Products
INSERT INTO "products" ("id", "title", "description", "price", "minOrderQuantity", "unit", "images", "status", "manufacturerId", "categoryId", "updatedAt")
VALUES 
  -- Kundan & Bridal
  ('prod-5', 'Royal Heritage Kundan Choker Set', 'Handcrafted brass base with Meenakari back work and emerald bead drops. Complete bridal luxury set.', 1450, 15, 'set', '["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"]', 'ACTIVE', 'usr-mfr-4', 'cat-7', NOW()),
  ('prod-6', 'Jadau Chandbali Statement Earrings', 'Traditional royal Rajasthani Chandbali with pearl tassels and uncut stone glass setting.', 420, 25, 'pair', '["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"]', 'ACTIVE', 'usr-mfr-4', 'cat-7', NOW()),
  ('prod-7', 'Antique Temple Coin Long Haar', 'Kemp stone studded Lakshmi coin necklace with brushed gold antique polish.', 890, 20, 'piece', '["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800"]', 'ACTIVE', 'usr-mfr-4', 'cat-7', NOW()),

  -- Waterproof & Everyday (Stainless Steel / PVD)
  ('prod-8', 'Waterproof Chunky Croissant Ring', '18K PVD gold plated 316L stainless steel. Anti-tarnish, sweatproof, and hypoallergenic.', 95, 50, 'piece', '["https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800"]', 'ACTIVE', 'usr-mfr-8', 'cat-8', NOW()),
  ('prod-9', 'Snake Chain Herringbone Necklace', '3mm flat herringbone snake chain, high-luster polish with durable lobster clasp.', 110, 50, 'piece', '["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"]', 'ACTIVE', 'usr-mfr-5', 'cat-6', NOW()),
  ('prod-10', 'Paperclip Link Layered Chain', 'Modern minimalist rectangular link chain necklace in 925 sterling silver.', 135, 40, 'piece', '["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"]', 'ACTIVE', 'usr-mfr-5', 'cat-6', NOW()),
  ('prod-11', 'Waterproof Roman Numeral Bangle', 'Hinged oval cuff bracelet with engraved Roman accents and hidden clasp lock.', 165, 30, 'piece', '["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800"]', 'ACTIVE', 'usr-mfr-8', 'cat-5', NOW()),

  -- Pearls & Delicate Pieces
  ('prod-12', 'Baroque Freshwater Pearl Pendant', 'Natural baroque irregular freshwater pearl wrapped in 14K gold filled wire.', 175, 25, 'piece', '["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"]', 'ACTIVE', 'usr-mfr-6', 'cat-2', NOW()),
  ('prod-13', 'Asymmetric Pearl Drop Huggie Hoops', '925 silver micro-pave huggies with detachable natural seed pearls.', 130, 35, 'pair', '["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"]', 'ACTIVE', 'usr-mfr-6', 'cat-1', NOW()),
  ('prod-14', 'Multi-Strand Rice Pearl Choker', 'Triple layered graded rice pearls with vintage magnetic filigree clasp.', 340, 20, 'piece', '["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"]', 'ACTIVE', 'usr-mfr-6', 'cat-2', NOW()),

  -- Bracelets & Rings
  ('prod-15', 'Tennis Bracelet with 3mm CZ Solitaires', 'Classic prong-set cubic zirconia line bracelet with double safety latch.', 210, 30, 'piece', '["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800"]', 'ACTIVE', 'usr-mfr-1', 'cat-5', NOW()),
  ('prod-16', 'Twisted Dome Signet Ring', 'Bold sculptural statement signet ring in cast sterling silver, mirror finish.', 140, 40, 'piece', '["https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800"]', 'ACTIVE', 'usr-mfr-2', 'cat-3', NOW()),
  ('prod-17', 'Enamel Evil Eye Stacking Bands', 'Vibrant hand-applied glass enamel on gold vermeil stackable rings.', 75, 60, 'piece', '["https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&q=80&w=800"]', 'ACTIVE', 'usr-mfr-1', 'cat-3', NOW()),
  ('prod-18', 'Textured Cable Wire Kada', 'Heavy 6mm flexible twisted cable wire open cuff with polished sphere ends.', 195, 25, 'piece', '["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800"]', 'ACTIVE', 'usr-mfr-8', 'cat-5', NOW()),

  -- Custom Brand Packaging
  ('prod-19', 'Drawer Sliding Jewellery Gift Box', 'Matte black rigid cardboard sliding box with ribbon pull and foam insert.', 55, 100, 'piece', '["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800"]', 'ACTIVE', 'usr-mfr-7', 'cat-4', NOW()),
  ('prod-20', 'Suede Envelope Snap Pouches', 'Luxury faux suede envelope pouch with metallic snap button and debossed logo.', 28, 150, 'piece', '["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800"]', 'ACTIVE', 'usr-mfr-7', 'cat-4', NOW())
ON CONFLICT ("id") DO NOTHING;
