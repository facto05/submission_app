/**
 * Product Store using Zustand
 * Centralized state management for products
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ProductEntity } from '../../domain/entities/product';
import { GetProductsUseCase } from '../../domain/usecases/get_products.usecase';
import { ProductRepositoryImpl } from '../../data/repositories/product_repository_impl';
import { RemoteProductDatasource } from '../../data/datasources/remote_product_datasource';
import { isSuccess } from '../../core/utils/result';

export interface ProductState {
  // State
  products: ProductEntity[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setProducts: (products: ProductEntity[]) => void;
  addProducts: (products: ProductEntity[]) => void;
  reset: () => void;
  fetchProducts: (limit?: number, skip?: number) => Promise<void>;
  loadMore: (limit?: number) => Promise<void>;
}

const initialState = {
  products: [],
  isLoading: false,
  error: null,
  hasMore: true,
  currentPage: 0,
};

// Initialize repository and use case
const remoteProductDatasource = new RemoteProductDatasource();
const productRepository = new ProductRepositoryImpl(remoteProductDatasource);
const getProductsUseCase = new GetProductsUseCase(productRepository);

export const useProductStore = create<ProductState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setLoading: (loading: boolean) =>
        set(
          (_state) => ({
            isLoading: loading,
          }),
          false,
          'setLoading',
        ),

      setError: (error: string | null) =>
        set(
          (_state) => ({
            error,
          }),
          false,
          'setError',
        ),

      setProducts: (products: ProductEntity[]) =>
        set(
          (_state) => ({
            products,
            currentPage: 0,
          }),
          false,
          'setProducts',
        ),

      addProducts: (products: ProductEntity[]) =>
        set(
          (state) => ({
            products: [...state.products, ...products],
          }),
          false,
          'addProducts',
        ),

      reset: () =>
        set(
          (_state) => ({
            ...initialState,
          }),
          false,
          'reset',
        ),

      fetchProducts: async (limit: number = 30, skip: number = 0) => {
        set({ isLoading: true, error: null });
        try {
          const result = await getProductsUseCase.execute(limit, skip);

          if (isSuccess(result)) {
            set(
              {
                products: result.data || [],
                isLoading: false,
                currentPage: Math.floor(skip / limit),
                hasMore: (result.data || []).length === limit,
              },
              false,
              'fetchProducts',
            );
          } else {
            set(
              {
                error: result.message,
                isLoading: false,
              },
              false,
              'fetchProducts',
            );
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          set(
            {
              error: message,
              isLoading: false,
            },
            false,
            'fetchProducts',
          );
        }
      },

      loadMore: async (limit: number = 30) => {
        const state = get();
        if (!state.hasMore || state.isLoading) return;

        const skip = (state.currentPage + 1) * limit;
        set({ isLoading: true, error: null });

        try {
          const result = await getProductsUseCase.execute(limit, skip);

          if (isSuccess(result)) {
            set(
              {
                products: [...state.products, ...(result.data || [])],
                isLoading: false,
                currentPage: state.currentPage + 1,
                hasMore: (result.data || []).length === limit,
              },
              false,
              'loadMore',
            );
          } else {
            set(
              {
                error: result.message,
                isLoading: false,
              },
              false,
              'loadMore',
            );
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          set(
            {
              error: message,
              isLoading: false,
            },
            false,
            'loadMore',
          );
        }
      },
    }),
    {
      name: 'ProductStore',
    },
  ),
);
