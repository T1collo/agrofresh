-- Insert categories
INSERT INTO categories (name, description, image_url) VALUES
  ('Fresh Produce', 'Fresh fruits and vegetables from local farms', '/images/categories/fresh-produce.jpg'),
  ('Meat & Poultry', 'Fresh meat and poultry products', '/images/categories/meat-poultry.jpg'),
  ('Dairy Products', 'Fresh dairy products', '/images/categories/dairy.jpg'),
  ('Eggs', 'Fresh eggs from local farms', '/images/categories/eggs.jpg'),
  ('Baked Goods', 'Freshly baked goods', '/images/categories/bakery.jpg'),
  ('Honey & Bee Products', 'Natural honey and bee products', '/images/categories/honey.jpg'),
  ('Preserves & Jams', 'Homemade preserves and jams', '/images/categories/preserves.jpg'),
  ('Herbal Products', 'Natural herbal products', '/images/categories/herbal.jpg'),
  ('Flowers & Plants', 'Fresh flowers and plants', '/images/categories/flowers.jpg'),
  ('Crafts & Artisan Goods', 'Handcrafted artisan products', '/images/categories/crafts.jpg');

-- Insert products with units and quantities
INSERT INTO products (name, description, price, stock, image_url, category_id, unit, unit_quantity) VALUES
  -- Fresh Produce
  ('Tomatoes', 'Fresh, ripe tomatoes', 3.99, 100, '/images/products/tomatoes.jpg', 
    (SELECT id FROM categories WHERE name = 'Fresh Produce'), 'kg', 1.0),
  ('Onions', 'Fresh yellow onions', 2.99, 150, '/images/products/onions.jpg',
    (SELECT id FROM categories WHERE name = 'Fresh Produce'), 'kg', 1.0),
  ('Carrots', 'Organic carrots', 2.49, 200, '/images/products/carrots.jpg',
    (SELECT id FROM categories WHERE name = 'Fresh Produce'), 'kg', 1.0),
  ('Potatoes', 'Fresh potatoes', 4.99, 180, '/images/products/potatoes.jpg',
    (SELECT id FROM categories WHERE name = 'Fresh Produce'), 'kg', 1.0),
  ('Spinach', 'Fresh organic spinach', 3.49, 80, '/images/products/spinach.jpg',
    (SELECT id FROM categories WHERE name = 'Fresh Produce'), 'bunch', 1.0),
  ('Kale', 'Organic kale', 3.99, 60, '/images/products/kale.jpg',
    (SELECT id FROM categories WHERE name = 'Fresh Produce'), 'bunch', 1.0),
  ('Lettuce', 'Fresh iceberg lettuce', 2.99, 90, '/images/products/lettuce.jpg',
    (SELECT id FROM categories WHERE name = 'Fresh Produce'), 'piece', 1.0),
  ('Cabbage', 'Fresh green cabbage', 3.49, 70, '/images/products/cabbage.jpg',
    (SELECT id FROM categories WHERE name = 'Fresh Produce'), 'piece', 1.0),
  ('Bell Peppers', 'Mixed color bell peppers', 4.99, 120, '/images/products/bell-peppers.jpg',
    (SELECT id FROM categories WHERE name = 'Fresh Produce'), 'piece', 1.0),
  ('Cucumbers', 'Fresh cucumbers', 2.99, 100, '/images/products/cucumbers.jpg',
    (SELECT id FROM categories WHERE name = 'Fresh Produce'), 'piece', 1.0),
  ('Avocados', 'Ripe avocados', 3.99, 80, '/images/products/avocados.jpg',
    (SELECT id FROM categories WHERE name = 'Fresh Produce'), 'piece', 1.0),
  ('Mangoes', 'Sweet mangoes', 2.99, 150, '/images/products/mangoes.jpg',
    (SELECT id FROM categories WHERE name = 'Fresh Produce'), 'piece', 1.0),
  ('Bananas', 'Fresh bananas', 1.99, 200, '/images/products/bananas.jpg',
    (SELECT id FROM categories WHERE name = 'Fresh Produce'), 'bunch', 3.0),
  ('Papayas', 'Ripe papayas', 4.99, 60, '/images/products/papayas.jpg',
    (SELECT id FROM categories WHERE name = 'Fresh Produce'), 'piece', 1.0),
  ('Oranges', 'Sweet oranges', 3.49, 180, '/images/products/oranges.jpg',
    (SELECT id FROM categories WHERE name = 'Fresh Produce'), 'kg', 1.0),
  ('Pineapples', 'Fresh pineapples', 5.99, 50, '/images/products/pineapples.jpg',
    (SELECT id FROM categories WHERE name = 'Fresh Produce'), 'piece', 1.0),
  ('Watermelons', 'Sweet watermelons', 7.99, 30, '/images/products/watermelons.jpg',
    (SELECT id FROM categories WHERE name = 'Fresh Produce'), 'piece', 1.0),

  -- Meat & Poultry
  ('Beef Steak', 'Premium beef steak', 15.99, 50, '/images/products/beef-steak.jpg',
    (SELECT id FROM categories WHERE name = 'Meat & Poultry'), 'kg', 1.0),
  ('Beef Ribs', 'Fresh beef ribs', 12.99, 40, '/images/products/beef-ribs.jpg',
    (SELECT id FROM categories WHERE name = 'Meat & Poultry'), 'kg', 1.0),
  ('Beef Mince', 'Ground beef', 8.99, 60, '/images/products/beef-mince.jpg',
    (SELECT id FROM categories WHERE name = 'Meat & Poultry'), 'kg', 1.0),
  ('Goat Meat', 'Fresh goat meat', 14.99, 30, '/images/products/goat-meat.jpg',
    (SELECT id FROM categories WHERE name = 'Meat & Poultry'), 'kg', 1.0),
  ('Pork Chops', 'Fresh pork chops', 9.99, 45, '/images/products/pork-chops.jpg',
    (SELECT id FROM categories WHERE name = 'Meat & Poultry'), 'kg', 1.0),
  ('Pork Belly', 'Fresh pork belly', 11.99, 35, '/images/products/pork-belly.jpg',
    (SELECT id FROM categories WHERE name = 'Meat & Poultry'), 'kg', 1.0),
  ('Pork Sausages', 'Fresh pork sausages', 7.99, 70, '/images/products/pork-sausages.jpg',
    (SELECT id FROM categories WHERE name = 'Meat & Poultry'), 'pack', 6.0),
  ('Whole Chicken', 'Fresh whole chicken', 12.99, 40, '/images/products/whole-chicken.jpg',
    (SELECT id FROM categories WHERE name = 'Meat & Poultry'), 'piece', 1.0),
  ('Chicken Drumsticks', 'Fresh chicken drumsticks', 6.99, 80, '/images/products/chicken-drumsticks.jpg',
    (SELECT id FROM categories WHERE name = 'Meat & Poultry'), 'kg', 1.0),
  ('Chicken Wings', 'Fresh chicken wings', 7.99, 90, '/images/products/chicken-wings.jpg',
    (SELECT id FROM categories WHERE name = 'Meat & Poultry'), 'kg', 1.0),
  ('Chicken Breasts', 'Fresh chicken breasts', 8.99, 70, '/images/products/chicken-breasts.jpg',
    (SELECT id FROM categories WHERE name = 'Meat & Poultry'), 'kg', 1.0),
  ('Duck', 'Whole fresh duck', 18.99, 25, '/images/products/duck.jpg',
    (SELECT id FROM categories WHERE name = 'Meat & Poultry'), 'piece', 1.0),
  ('Turkey', 'Whole fresh turkey', 24.99, 20, '/images/products/turkey.jpg',
    (SELECT id FROM categories WHERE name = 'Meat & Poultry'), 'piece', 1.0),
  ('Smoked Ham', 'Premium smoked ham', 13.99, 35, '/images/products/smoked-ham.jpg',
    (SELECT id FROM categories WHERE name = 'Meat & Poultry'), 'kg', 1.0),

  -- Dairy Products
  ('Fresh Milk', 'Whole fresh milk', 4.99, 100, '/images/products/milk.jpg',
    (SELECT id FROM categories WHERE name = 'Dairy Products'), 'liter', 1.0),
  ('Cheddar Cheese', 'Aged cheddar cheese', 6.99, 80, '/images/products/cheddar-cheese.jpg',
    (SELECT id FROM categories WHERE name = 'Dairy Products'), 'kg', 1.0),
  ('Feta Cheese', 'Greek feta cheese', 7.99, 60, '/images/products/feta-cheese.jpg',
    (SELECT id FROM categories WHERE name = 'Dairy Products'), 'kg', 1.0),
  ('Mozzarella', 'Fresh mozzarella', 5.99, 70, '/images/products/mozzarella.jpg',
    (SELECT id FROM categories WHERE name = 'Dairy Products'), 'kg', 1.0),
  ('Plain Yogurt', 'Greek-style plain yogurt', 3.99, 90, '/images/products/plain-yogurt.jpg',
    (SELECT id FROM categories WHERE name = 'Dairy Products'), 'liter', 1.0),
  ('Flavored Yogurt', 'Assorted flavored yogurt', 4.49, 85, '/images/products/flavored-yogurt.jpg',
    (SELECT id FROM categories WHERE name = 'Dairy Products'), 'piece', 1.0),
  ('Butter', 'Fresh butter', 5.49, 75, '/images/products/butter.jpg',
    (SELECT id FROM categories WHERE name = 'Dairy Products'), 'kg', 1.0),
  ('Ghee', 'Pure ghee', 8.99, 50, '/images/products/ghee.jpg',
    (SELECT id FROM categories WHERE name = 'Dairy Products'), 'liter', 1.0),
  ('Cream', 'Fresh cream', 4.49, 65, '/images/products/cream.jpg',
    (SELECT id FROM categories WHERE name = 'Dairy Products'), 'liter', 1.0),
  ('Dairy Spread', 'Creamy dairy spread', 3.99, 80, '/images/products/dairy-spread.jpg',
    (SELECT id FROM categories WHERE name = 'Dairy Products'), 'kg', 1.0),

  -- Eggs
  ('Regular Eggs', 'Dozen regular eggs', 4.99, 200, '/images/products/regular-eggs.jpg',
    (SELECT id FROM categories WHERE name = 'Eggs'), 'dozen', 12.0),
  ('Free-Range Eggs', 'Dozen free-range eggs', 6.99, 150, '/images/products/free-range-eggs.jpg',
    (SELECT id FROM categories WHERE name = 'Eggs'), 'dozen', 12.0),
  ('Duck Eggs', 'Half dozen duck eggs', 7.99, 80, '/images/products/duck-eggs.jpg',
    (SELECT id FROM categories WHERE name = 'Eggs'), 'half-dozen', 6.0),
  ('Quail Eggs', 'Dozen quail eggs', 5.99, 100, '/images/products/quail-eggs.jpg',
    (SELECT id FROM categories WHERE name = 'Eggs'), 'dozen', 12.0),
  ('Organic Eggs', 'Dozen organic eggs', 8.99, 120, '/images/products/organic-eggs.jpg',
    (SELECT id FROM categories WHERE name = 'Eggs'), 'dozen', 12.0),

  -- Baked Goods
  ('White Bread', 'Fresh white bread loaf', 3.99, 50, '/images/products/white-bread.jpg',
    (SELECT id FROM categories WHERE name = 'Baked Goods'), 'loaf', 1.0),
  ('Whole Wheat Bread', 'Fresh whole wheat bread', 4.49, 45, '/images/products/whole-wheat-bread.jpg',
    (SELECT id FROM categories WHERE name = 'Baked Goods'), 'loaf', 1.0),
  ('Sourdough Bread', 'Artisan sourdough bread', 5.99, 40, '/images/products/sourdough-bread.jpg',
    (SELECT id FROM categories WHERE name = 'Baked Goods'), 'loaf', 1.0),
  ('Dinner Rolls', 'Fresh dinner rolls', 3.49, 60, '/images/products/dinner-rolls.jpg',
    (SELECT id FROM categories WHERE name = 'Baked Goods'), 'pack', 6.0),
  ('Chocolate Cake', 'Rich chocolate cake', 24.99, 10, '/images/products/chocolate-cake.jpg',
    (SELECT id FROM categories WHERE name = 'Baked Goods'), 'piece', 1.0),
  ('Cupcakes', 'Assorted cupcakes', 2.99, 100, '/images/products/cupcakes.jpg',
    (SELECT id FROM categories WHERE name = 'Baked Goods'), 'pack', 4.0),
  ('Chocolate Chip Cookies', 'Fresh baked cookies', 4.99, 80, '/images/products/chocolate-chip-cookies.jpg',
    (SELECT id FROM categories WHERE name = 'Baked Goods'), 'pack', 12.0),
  ('Blueberry Muffins', 'Fresh blueberry muffins', 3.49, 70, '/images/products/blueberry-muffins.jpg',
    (SELECT id FROM categories WHERE name = 'Baked Goods'), 'pack', 4.0),
  ('Apple Pie', 'Fresh apple pie', 12.99, 15, '/images/products/apple-pie.jpg',
    (SELECT id FROM categories WHERE name = 'Baked Goods'), 'piece', 1.0),
  ('Meat Pie', 'Fresh meat pie', 6.99, 30, '/images/products/meat-pie.jpg',
    (SELECT id FROM categories WHERE name = 'Baked Goods'), 'piece', 1.0),

  -- Honey & Bee Products
  ('Raw Honey', 'Pure raw honey', 12.99, 40, '/images/products/raw-honey.jpg',
    (SELECT id FROM categories WHERE name = 'Honey & Bee Products'), 'jar', 0.5),
  ('Processed Honey', 'Filtered honey', 9.99, 60, '/images/products/processed-honey.jpg',
    (SELECT id FROM categories WHERE name = 'Honey & Bee Products'), 'jar', 0.5),
  ('Beeswax', 'Pure beeswax', 8.99, 30, '/images/products/beeswax.jpg',
    (SELECT id FROM categories WHERE name = 'Honey & Bee Products'), 'block', 0.25),
  ('Propolis', 'Natural propolis', 15.99, 25, '/images/products/propolis.jpg',
    (SELECT id FROM categories WHERE name = 'Honey & Bee Products'), 'bottle', 0.05),
  ('Honeycomb', 'Fresh honeycomb', 14.99, 20, '/images/products/honeycomb.jpg',
    (SELECT id FROM categories WHERE name = 'Honey & Bee Products'), 'piece', 0.25),
  ('Bee Pollen', 'Pure bee pollen', 16.99, 15, '/images/products/bee-pollen.jpg',
    (SELECT id FROM categories WHERE name = 'Honey & Bee Products'), 'jar', 0.1),

  -- Preserves & Jams
  ('Mango Jam', 'Sweet mango jam', 5.99, 45, '/images/products/mango-jam.jpg',
    (SELECT id FROM categories WHERE name = 'Preserves & Jams'), 'jar', 0.25),
  ('Strawberry Jam', 'Fresh strawberry jam', 5.99, 40, '/images/products/strawberry-jam.jpg',
    (SELECT id FROM categories WHERE name = 'Preserves & Jams'), 'jar', 0.25),
  ('Orange Marmalade', 'Tangy orange marmalade', 5.49, 35, '/images/products/orange-marmalade.jpg',
    (SELECT id FROM categories WHERE name = 'Preserves & Jams'), 'jar', 0.25),
  ('Tomato Relish', 'Spicy tomato relish', 4.99, 50, '/images/products/tomato-relish.jpg',
    (SELECT id FROM categories WHERE name = 'Preserves & Jams'), 'jar', 0.25),
  ('Pickled Vegetables', 'Assorted pickled vegetables', 6.99, 30, '/images/products/pickled-vegetables.jpg',
    (SELECT id FROM categories WHERE name = 'Preserves & Jams'), 'jar', 0.5),
  ('Fruit Chutney', 'Mixed fruit chutney', 5.49, 40, '/images/products/fruit-chutney.jpg',
    (SELECT id FROM categories WHERE name = 'Preserves & Jams'), 'jar', 0.25),
  ('Sauerkraut', 'Traditional sauerkraut', 4.99, 35, '/images/products/sauerkraut.jpg',
    (SELECT id FROM categories WHERE name = 'Preserves & Jams'), 'jar', 0.5),

  -- Herbal Products
  ('Dried Mint', 'Organic dried mint', 4.99, 60, '/images/products/dried-mint.jpg',
    (SELECT id FROM categories WHERE name = 'Herbal Products'), 'pack', 0.05),
  ('Dried Basil', 'Organic dried basil', 4.99, 55, '/images/products/dried-basil.jpg',
    (SELECT id FROM categories WHERE name = 'Herbal Products'), 'pack', 0.05),
  ('Dried Thyme', 'Organic dried thyme', 4.99, 50, '/images/products/dried-thyme.jpg',
    (SELECT id FROM categories WHERE name = 'Herbal Products'), 'pack', 0.05),
  ('Lemongrass Tea', 'Natural lemongrass tea', 5.99, 40, '/images/products/lemongrass-tea.jpg',
    (SELECT id FROM categories WHERE name = 'Herbal Products'), 'pack', 0.025),
  ('Hibiscus Tea', 'Natural hibiscus tea', 5.99, 45, '/images/products/hibiscus-tea.jpg',
    (SELECT id FROM categories WHERE name = 'Herbal Products'), 'pack', 0.025),
  ('Chamomile Tea', 'Natural chamomile tea', 5.99, 50, '/images/products/chamomile-tea.jpg',
    (SELECT id FROM categories WHERE name = 'Herbal Products'), 'pack', 0.025),
  ('Lavender Oil', 'Pure lavender essential oil', 12.99, 30, '/images/products/lavender-oil.jpg',
    (SELECT id FROM categories WHERE name = 'Herbal Products'), 'bottle', 0.01),
  ('Moringa Powder', 'Organic moringa powder', 9.99, 40, '/images/products/moringa-powder.jpg',
    (SELECT id FROM categories WHERE name = 'Herbal Products'), 'pack', 0.1),

  -- Flowers & Plants
  ('Rose Bouquet', 'Fresh rose bouquet', 24.99, 20, '/images/products/rose-bouquet.jpg',
    (SELECT id FROM categories WHERE name = 'Flowers & Plants'), 'bouquet', 12.0),
  ('Sunflower Bouquet', 'Fresh sunflower bouquet', 19.99, 25, '/images/products/sunflower-bouquet.jpg',
    (SELECT id FROM categories WHERE name = 'Flowers & Plants'), 'bouquet', 5.0),
  ('Mixed Flower Bouquet', 'Assorted fresh flowers', 29.99, 15, '/images/products/mixed-flower-bouquet.jpg',
    (SELECT id FROM categories WHERE name = 'Flowers & Plants'), 'bouquet', 1.0),
  ('Herb Plant', 'Potted herb plant', 8.99, 40, '/images/products/herb-plant.jpg',
    (SELECT id FROM categories WHERE name = 'Flowers & Plants'), 'pot', 1.0),
  ('Succulent Plant', 'Potted succulent', 12.99, 35, '/images/products/succulent-plant.jpg',
    (SELECT id FROM categories WHERE name = 'Flowers & Plants'), 'pot', 1.0),
  ('Vegetable Seedlings', 'Assorted vegetable seedlings', 3.99, 100, '/images/products/vegetable-seedlings.jpg',
    (SELECT id FROM categories WHERE name = 'Flowers & Plants'), 'tray', 6.0),
  ('Indoor Plant', 'Decorative indoor plant', 19.99, 30, '/images/products/indoor-plant.jpg',
    (SELECT id FROM categories WHERE name = 'Flowers & Plants'), 'pot', 1.0),

  -- Crafts & Artisan Goods
  ('Handmade Basket', 'Traditional woven basket', 24.99, 20, '/images/products/handmade-basket.jpg',
    (SELECT id FROM categories WHERE name = 'Crafts & Artisan Goods'), 'piece', 1.0),
  ('Wooden Utensils', 'Hand-carved wooden utensils', 14.99, 30, '/images/products/wooden-utensils.jpg',
    (SELECT id FROM categories WHERE name = 'Crafts & Artisan Goods'), 'set', 4.0),
  ('Ceramic Pottery', 'Handmade ceramic piece', 29.99, 15, '/images/products/ceramic-pottery.jpg',
    (SELECT id FROM categories WHERE name = 'Crafts & Artisan Goods'), 'piece', 1.0),
  ('Handwoven Textile', 'Traditional handwoven textile', 34.99, 10, '/images/products/handwoven-textile.jpg',
    (SELECT id FROM categories WHERE name = 'Crafts & Artisan Goods'), 'piece', 1.0),
  ('Natural Soap', 'Handmade natural soap', 6.99, 50, '/images/products/natural-soap.jpg',
    (SELECT id FROM categories WHERE name = 'Crafts & Artisan Goods'), 'bar', 1.0),
  ('Scented Candle', 'Hand-poured scented candle', 12.99, 40, '/images/products/scented-candle.jpg',
    (SELECT id FROM categories WHERE name = 'Crafts & Artisan Goods'), 'piece', 1.0),
  ('Beaded Jewelry', 'Handmade beaded jewelry', 19.99, 25, '/images/products/beaded-jewelry.jpg',
    (SELECT id FROM categories WHERE name = 'Crafts & Artisan Goods'), 'piece', 1.0),
  ('Local Art Piece', 'Original local artwork', 49.99, 8, '/images/products/local-art.jpg',
    (SELECT id FROM categories WHERE name = 'Crafts & Artisan Goods'), 'piece', 1.0);

-- Create admin user (password: admin123)
-- Note: This will be created when the admin signs up through the application
-- The following is just a placeholder for the admin user's profile
INSERT INTO users (id, email, name, role, is_active)
VALUES (
  '006d7dd5-5ff2-4dfa-8744-7bc48034cbf8', -- Replace with actual UUID after admin signup
  'admin@agrofresh.com',
  'Admin User',
  'ADMIN',
  true
);

-- Insert sample addresses for admin
INSERT INTO addresses (user_id, street, city, state, postal_code, country, is_default)
VALUES (
  '006d7dd5-5ff2-4dfa-8744-7bc48034cbf8', -- Replace with actual admin UUID
  '123 Admin Street',
  'Admin City',
  'Admin State',
  '12345',
  'Admin Country',
  true
);

-- Insert sample orders for admin
INSERT INTO orders (user_id, total, status, shipping_address_id)
VALUES (
  '006d7dd5-5ff2-4dfa-8744-7bc48034cbf8', -- Replace with actual admin UUID
  45.97,
  'DELIVERED',
  (SELECT id FROM addresses WHERE user_id = '006d7dd5-5ff2-4dfa-8744-7bc48034cbf8' LIMIT 1)
);

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES (
  (SELECT id FROM orders WHERE user_id = '006d7dd5-5ff2-4dfa-8744-7bc48034cbf8' LIMIT 1),
  (SELECT id FROM products WHERE name = 'Organic Apples' LIMIT 1),
  2,
  2.99
),
(
  (SELECT id FROM orders WHERE user_id = '006d7dd5-5ff2-4dfa-8744-7bc48034cbf8' LIMIT 1),
  (SELECT id FROM products WHERE name = 'Whole Milk' LIMIT 1),
  1,
  3.99
),
(
  (SELECT id FROM orders WHERE user_id = '006d7dd5-5ff2-4dfa-8744-7bc48034cbf8' LIMIT 1),
  (SELECT id FROM products WHERE name = 'Sourdough Bread' LIMIT 1),
  1,
  5.99
); 