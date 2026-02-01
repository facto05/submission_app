/**
 * ProductCard Component
 * Display individual product in grid
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ViewStyle,
} from 'react-native';
import { useColors } from '../hooks/useThemeColors';
import { ProductEntity } from '../../domain/entities/product';

export interface ProductCardProps {
  product: ProductEntity;
  onPress?: (product: ProductEntity) => void;
  containerStyle?: ViewStyle;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  containerStyle,
}) => {
  const colors = useColors();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.card,
          borderRadius: 12,
          overflow: 'hidden',
          borderColor: colors.border,
          borderWidth: 1,
        },
        image: {
          width: '100%',
          height: 180,
          backgroundColor: colors.surface,
        },
        content: {
          padding: 12,
        },
        title: {
          fontSize: 14,
          fontWeight: '600' as const,
          color: colors.text,
          marginBottom: 8,
        },
        priceContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8,
        },
        price: {
          fontSize: 14,
          fontWeight: '700' as const,
          color: colors.primary,
        },
        originalPrice: {
          fontSize: 12,
          color: colors.textSecondary,
          marginLeft: 8,
          textDecorationLine: 'line-through' as const,
        },
        discountBadge: {
          backgroundColor: '#FF6B6B',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 4,
          marginLeft: 'auto' as const,
        },
        discountText: {
          color: '#FFFFFF',
          fontSize: 10,
          fontWeight: '600' as const,
        },
        ratingContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8,
        },
        rating: {
          fontSize: 12,
          color: colors.textSecondary,
          marginLeft: 4,
        },
        stockText: {
          fontSize: 11,
          color: colors.textSecondary,
        },
        stockAvailable: {
          color: '#34C759',
        },
        stockOutOfStock: {
          color: '#FF3B30',
        },
      }),
    [colors],
  );

  const isOutOfStock = (product.stock ?? 0) <= 0;
  const discountedPrice = product.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;
  return (
    <Pressable
      style={[styles.container, containerStyle]}
      onPress={() => onPress?.(product)}
      accessibilityRole="button"
      accessibilityLabel={`Product: ${product.title}`}
    >
      <Image
        source={{
          uri: product.thumbnail || 'https://via.placeholder.com/200',
        }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${discountedPrice.toFixed(2)}</Text>
          {product.discountPercentage && (
            <>
              <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{product.discountPercentage.toFixed(0)}%</Text>
              </View>
            </>
          )}
        </View>

        {product.rating && (
          <View style={styles.ratingContainer}>
            <Text>⭐</Text>
            <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
          </View>
        )}

        <Text
          style={[
            styles.stockText,
            isOutOfStock ? styles.stockOutOfStock : styles.stockAvailable,
          ]}
        >
          {isOutOfStock ? 'Out of Stock' : `Stock: ${product.stock}`}
        </Text>
      </View>
    </Pressable>
  );
};

export default ProductCard;
