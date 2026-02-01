/**
 * Product Repository Implementation
 * Implements IProductRepository interface
 */

import { Result } from '../../core/utils/result';
import { ProductEntity } from '../../domain/entities/product';
import { IProductRepository } from '../../domain/repositories/product.repository';
import { RemoteProductDatasource } from '../datasources/remote_product_datasource';

export class ProductRepositoryImpl implements IProductRepository {
  constructor(private readonly remoteProductDatasource: RemoteProductDatasource) {}

  async getProducts(limit: number = 30, skip: number = 0): Promise<Result<ProductEntity[]>> {
    return this.remoteProductDatasource.getProducts(limit, skip);
  }

  async getProduct(id: string | number): Promise<Result<ProductEntity>> {
    return this.remoteProductDatasource.getProduct(id);
  }

  async searchProducts(query: string): Promise<Result<ProductEntity[]>> {
    return this.remoteProductDatasource.searchProducts(query);
  }
}
