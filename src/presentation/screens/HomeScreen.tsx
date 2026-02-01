/**
 * Home screen component
 * Display user header and product grid
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProductStore } from '../../presentation/store';
import { useAuthStore } from '../../presentation/store';
import { useColors } from '../hooks/useThemeColors';
import { UserHeader } from '../components/UserHeader';
import { ProductCard } from '../components/ProductCard';
import { ProductEntity } from '../../domain/entities/product';
import { RootStackParamList } from './ProductDetailScreen';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const colors = useColors();
  const { products, isLoading, error, fetchProducts, loadMore, hasMore } =
    useProductStore();
  const { user: authUser } = useAuthStore();

  // Fetch products on mount
  useEffect(() => {
    fetchProducts(30, 0);
  }, []);

  const handleEndReached = () => {
    if (hasMore && !isLoading) {
      loadMore(30);
    }
  };

  const handleProductPress = (product: ProductEntity) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderProductCard = ({ item }: ListRenderItemInfo<ProductEntity>) => (
    <ProductCard
      product={item}
      onPress={handleProductPress}
      containerStyle={styles.productCard}
    />
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator size="large" color={colors.primary} style={styles.footer} />;
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No products found</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {authUser && (
        <UserHeader
          avatar={authUser.image}
          email={authUser.email}
          name={authUser.username}
        />
      )}

      {products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          scrollIndicatorInsets={{ right: 1 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    marginHorizontal: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
  },
  footer: {
    paddingVertical: 20,
  },
});
