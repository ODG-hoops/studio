export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  imageHint: string;
  category: 'Hoodies' | 'Sweatshirts' | 'Cotton T-Shirts';
  description: string;
  colors: string[];
  sizes: string[];
};
