
import type { Product } from './types';

export const products: Product[] = [
  {
    id: 'p3',
    name: 'Maverik Girlies',
    price: 200,
    stock: 15,
    image: 'https://i.postimg.cc/BQcT42Xk/maverik-girlies.jpg',
    imageHint: 'pink sweatshirt',
    category: 'Sweatshirts',
    colors: ['White', 'Blue', 'Black', 'Blue-black', 'Pink', 'Red'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'p1',
    name: '21st SM Hoodie',
    price: 350,
    stock: 10,
    image: 'https://i.postimg.cc/J7yDFdw7/21st-sm-hoodie-png.jpg',
    imageHint: 'black hoodie',
    category: 'Hoodies',
    colors: ['White', 'Blue', 'Black', 'Blue-black', 'Pink', 'Red'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'p4',
    name: 'Triple Cross Sweatshirt',
    price: 180,
    stock: 0,
    image: 'https://image2url.com/images/1765493588135-73d4cee3-577b-4d59-b443-3097ad3c0f9e.png',
    imageHint: 'graphic sweatshirt',
    category: 'Sweatshirts',
    colors: ['White', 'Blue', 'Black', 'Blue-black', 'Pink', 'Red'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'p6',
    name: 'Triple Cross Shirt',
    price: 150,
    stock: 25,
    image: 'https://image2url.com/images/1765491735715-9574afc1-4582-4a34-aca1-5bfb4f1bd2b0.jpeg',
    imageHint: 'graphic t-shirt',
    category: 'Cotton T-Shirts',
    colors: ['White', 'Blue', 'Black', 'Blue-black', 'Pink', 'Red'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
];
