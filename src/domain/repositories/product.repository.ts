/**
 * Product Repository Interface
 * Defines contract for product data operations
 */

import { Result } from '../../core/utils/result';
import { ProductEntity } from '../entities/product';

export interface IProductRepository {
  /**
   * Get list of products with pagination
   */
  getProducts(limit?: number, skip?: number): Promise<Result<ProductEntity[]>>;

  /**
   * Get single product by ID
   */
  getProduct(id: string | number): Promise<Result<ProductEntity>>;

  /**
   * Search products by query
   */
  searchProducts(query: string): Promise<Result<ProductEntity[]>>;
}
