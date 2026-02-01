/**
 * Get Products Use Case
 * Fetch products from repository
 */

import { Result } from '../../core/utils/result';
import { ProductEntity } from '../entities/product';
import { IProductRepository } from '../repositories/product.repository';

export class GetProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(limit?: number, skip?: number): Promise<Result<ProductEntity[]>> {
    return this.productRepository.getProducts(limit, skip);
  }
}

/**
 * Get Product Use Case
 * Fetch single product by ID
 */
export class GetProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string | number): Promise<Result<ProductEntity>> {
    return this.productRepository.getProduct(id);
  }
}

/**
 * Search Products Use Case
 * Search products by query
 */
export class SearchProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(query: string): Promise<Result<ProductEntity[]>> {
    return this.productRepository.searchProducts(query);
  }
}
