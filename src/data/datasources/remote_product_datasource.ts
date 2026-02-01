/**
 * Remote Product Data Source
 * Handles API calls to fetch product data
 */

import axios, { AxiosInstance } from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../../config/constants';
import { ProductEntity } from '../../domain/entities/product';
import { Result, Success, Failure } from '../../core/utils/result';

interface ProductResponse {
  id: number;
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

interface ProductsListResponse {
  products: ProductResponse[];
  total: number;
  skip: number;
  limit: number;
}

export class RemoteProductDatasource {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
    });
  }

  /**
   * Get list of products
   */
  async getProducts(limit: number = 30, skip: number = 0): Promise<Result<ProductEntity[]>> {
    try {
      const response = await this.client.get<ProductsListResponse>(
        `${API_ENDPOINTS.PRODUCTS.LIST}?limit=${limit}&skip=${skip}`,
      );

      const products = response.data.products.map(
        (product: ProductResponse) =>
          ({
            id: product.id.toString(),
            title: product.title,
            description: product.description,
            price: product.price,
            discountPercentage: product.discountPercentage,
            rating: product.rating,
            stock: product.stock,
            brand: product.brand,
            category: product.category,
            thumbnail: product.thumbnail,
            images: product.images,
          }) as ProductEntity,
      );

      return new Success(products);
    } catch (error) {
      console.error('Error fetching products:', error);

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
          return new Failure('NETWORK_ERROR', 'Network connection error');
        }

        if (error.response?.status === 500) {
          return new Failure('HTTP_ERROR', 'Server error occurred');
        }
      }

      return new Failure('UNKNOWN_ERROR', 'Failed to fetch products');
    }
  }

  /**
   * Get single product by ID
   */
  async getProduct(id: string | number): Promise<Result<ProductEntity>> {
    try {
      const response = await this.client.get<ProductResponse>(
        API_ENDPOINTS.PRODUCTS.DETAIL(id.toString()),
      );

      const product = {
        id: response.data.id.toString(),
        title: response.data.title,
        description: response.data.description,
        price: response.data.price,
        discountPercentage: response.data.discountPercentage,
        rating: response.data.rating,
        stock: response.data.stock,
        brand: response.data.brand,
        category: response.data.category,
        thumbnail: response.data.thumbnail,
        images: response.data.images,
      } as ProductEntity;

      return new Success(product);
    } catch (error) {
      console.error('Error fetching product:', error);

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
          return new Failure('NETWORK_ERROR', 'Network connection error');
        }

        if (error.response?.status === 404) {
          return new Failure('NOT_FOUND', 'Product not found');
        }
      }

      return new Failure('UNKNOWN_ERROR', 'Failed to fetch product');
    }
  }

  /**
   * Search products by query
   */
  async searchProducts(query: string): Promise<Result<ProductEntity[]>> {
    try {
      const response = await this.client.get<ProductsListResponse>(
        `${API_ENDPOINTS.PRODUCTS.SEARCH}?q=${encodeURIComponent(query)}`,
      );

      const products = response.data.products.map(
        (product: ProductResponse) =>
          ({
            id: product.id.toString(),
            title: product.title,
            description: product.description,
            price: product.price,
            discountPercentage: product.discountPercentage,
            rating: product.rating,
            stock: product.stock,
            brand: product.brand,
            category: product.category,
            thumbnail: product.thumbnail,
            images: product.images,
          }) as ProductEntity,
      );

      return new Success(products);
    } catch (error) {
      console.error('Error searching products:', error);

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
          return new Failure('NETWORK_ERROR', 'Network connection error');
        }
      }

      return new Failure('UNKNOWN_ERROR', 'Failed to search products');
    }
  }
}
