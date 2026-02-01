/**
 * Product entity for domain layer
 */

export interface ProductEntity {
  id: string | number;
  title: string;
  description?: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category?: string;
  thumbnail?: string;
  images?: string[];
}

export class Product implements ProductEntity {
  id: string | number;
  title: string;
  description?: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category?: string;
  thumbnail?: string;
  images?: string[];

  constructor(product: ProductEntity) {
    this.id = product.id;
    this.title = product.title;
    this.description = product.description;
    this.price = product.price;
    this.discountPercentage = product.discountPercentage;
    this.rating = product.rating;
    this.stock = product.stock;
    this.brand = product.brand;
    this.category = product.category;
    this.thumbnail = product.thumbnail;
    this.images = product.images;
  }

  isAvailable(): boolean {
    return (this.stock ?? 0) > 0;
  }

  getDiscountedPrice(): number {
    if (!this.discountPercentage) return this.price;
    return this.price * (1 - this.discountPercentage / 100);
  }
}
