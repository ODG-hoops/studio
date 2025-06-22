export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  imageHint: string;
  category: 'Men' | 'Women' | 'Unisex' | 'Accessories';
  description: string;
};
