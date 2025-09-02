export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  imageHint: string;
  category: 'Hoodies' | 'Sweatshirts' | 'Cotton T-Shirts' | 'Croptop' | 'Jersey';
  description: string;
  colors: string[];
  sizes: string[];
};
