// Fake products, created once in memory when the server starts. No database yet.
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

const CATEGORIES = ["phones", "laptops", "shoes", "books", "toys"];

export const products: Product[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  category: CATEGORIES[i % CATEGORIES.length],
  price: 100 + ((i * 37) % 900),
  inStock: i % 7 !== 0,
}));
