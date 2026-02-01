/**
 * Product Detail Screen
 * Shows full details of a product
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useColors } from '../hooks/useThemeColors';
import { ProductEntity } from '../../domain/entities/product';

export type RootStackParamList = {
  Home: undefined;
  ProductDetail: { product: ProductEntity };
};

type ProductDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProductDetail'
>;

interface ProductDetailScreenProps {
  navigation: ProductDetailScreenNavigationProp;
  route: {
    params: {
      product: ProductEntity;
    };
  };
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const colors = useColors();
  const product = route.params.product;

  const discountedPrice = product.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          justifyContent: 'space-between',
        },
        headerTitle: {
          fontSize: 18,
          fontWeight: '600' as const,
          color: colors.text,
          flex: 1,
          marginLeft: 12,
        },
        backButton: {
          paddingHorizontal: 8,
          paddingVertical: 8,
        },
        backButtonText: {
          fontSize: 28,
          color: colors.primary,
        },
        scrollContent: {
          paddingBottom: 20,
        },
        image: {
          width: '100%',
          height: 300,
          backgroundColor: colors.surface,
        },
        imageContainer: {
          position: 'relative' as const,
        },
        discountBadge: {
          position: 'absolute' as const,
          top: 16,
          right: 16,
          backgroundColor: '#FF6B6B',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
        },
        discountText: {
          color: '#FFFFFF',
          fontSize: 14,
          fontWeight: '700' as const,
        },
        contentSection: {
          paddingHorizontal: 16,
          paddingVertical: 16,
        },
        title: {
          fontSize: 20,
          fontWeight: '700' as const,
          color: colors.text,
          marginBottom: 8,
        },
        brand: {
          fontSize: 14,
          color: colors.textSecondary,
          marginBottom: 12,
        },
        priceSection: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        priceLabel: {
          fontSize: 12,
          color: colors.textSecondary,
          marginRight: 8,
        },
        currentPrice: {
          fontSize: 28,
          fontWeight: '700' as const,
          color: colors.primary,
        },
        originalPrice: {
          fontSize: 14,
          color: colors.textSecondary,
          marginLeft: 12,
          textDecorationLine: 'line-through' as const,
        },
        infoRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 12,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        infoLabel: {
          fontSize: 14,
          color: colors.textSecondary,
        },
        infoValue: {
          fontSize: 14,
          fontWeight: '600' as const,
          color: colors.text,
        },
        sectionTitle: {
          fontSize: 16,
          fontWeight: '600' as const,
          color: colors.text,
          marginBottom: 12,
          marginTop: 16,
        },
        description: {
          fontSize: 14,
          color: colors.textSecondary,
          lineHeight: 22,
          marginBottom: 16,
        },
        rating: {
          fontSize: 16,
          fontWeight: '600' as const,
          color: colors.text,
          marginBottom: 4,
        },
        addToCartButton: {
          backgroundColor: colors.primary,
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: 'center',
          marginHorizontal: 16,
          marginVertical: 16,
        },
        addToCartText: {
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: '600' as const,
        },
      }),
    [colors],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.title}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: product.thumbnail || 'https://via.placeholder.com/300',
            }}
            style={styles.image}
          />
          {product.discountPercentage && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{product.discountPercentage.toFixed(0)}%</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.contentSection}>
          <Text style={styles.title}>{product.title}</Text>
          {product.brand && <Text style={styles.brand}>{product.brand}</Text>}

          {/* Price */}
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.currentPrice}>${discountedPrice.toFixed(2)}</Text>
            {product.discountPercentage && (
              <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
            )}
          </View>

          {/* Rating */}
          {product.rating && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Rating</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.rating}>⭐ {product.rating.toFixed(1)}</Text>
              </View>
            </View>
          )}

          {/* Stock */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Stock</Text>
            <Text
              style={[
                styles.infoValue,
                {
                  color: (product.stock ?? 0) > 0 ? '#34C759' : '#FF3B30',
                },
              ]}
            >
              {(product.stock ?? 0) > 0 ? `Available (${product.stock})` : 'Out of Stock'}
            </Text>
          </View>

          {/* Category */}
          {product.category && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{product.category}</Text>
            </View>
          )}

          {/* Description */}
          {product.description && (
            <>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{product.description}</Text>
            </>
          )}
        </View>

        {/* Add to Cart Button */}
        {(product.stock ?? 0) > 0 && (
          <Pressable
            style={({ pressed }) => [
              styles.addToCartButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;
