const unsplash = (id, width = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

export const PRODUCT_IMAGES = {
  'iPhone 15 Pro': [unsplash('1592750475338-74b7b21085ab'), unsplash('1496181133206-80ce9b88a853')],
  'Samsung Galaxy S24': [
    unsplash('1610945265064-0e34e5519bbf'),
    unsplash('1592750475338-74b7b21085ab'),
  ],
  'Sony WH-1000XM5': [
    unsplash('1505740420928-5e560c06d30e'),
    unsplash('1523275335684-37898b6baf30'),
  ],
  'Dell XPS 13': [unsplash('1496181133206-80ce9b88a853'), unsplash('1517336714731-489689fd1ca8')],
  "Men's Classic Denim Jacket": [
    unsplash('1551537482-f2075a1d41f2'),
    unsplash('1583743814966-8936f5b7be1a'),
  ],
  'Running Shoes': [unsplash('1542291026-7eec264c27ff'), unsplash('1560343090-f0409e92791a')],
  'Leather Wallet': [unsplash('1627123424574-724758594e93'), unsplash('1523170335258-f5ed11844a49')],
  'Ceramic Dinner Set': [
    unsplash('1603199506016-b9a594b593c0'),
    unsplash('1556909212-d5b604d0c90d'),
  ],
  'Stainless Steel Cookware': [
    unsplash('1556909212-d5b604d0c90d'),
    unsplash('1585515320310-259814833e62'),
  ],
  'Air Fryer 5L': [unsplash('1585515320310-259814833e62'), unsplash('1556909212-d5b604d0c90d')],
  'Yoga Mat Pro': [unsplash('1544367567-0f2fcb009e0b'), unsplash('1517836357463-d25dfeac3438')],
  'Adjustable Dumbbell Set': [
    unsplash('1517836357463-d25dfeac3438'),
    unsplash('1544367567-0f2fcb009e0b'),
  ],
};
