/**
 * UserHeader Component
 * Simple header displaying user avatar and email
 * Reusable component for HomeScreen and DetailScreen
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  Pressable,
} from 'react-native';
import { useColors } from '../hooks/useThemeColors';

export interface UserHeaderProps {
  /** User's avatar URL */
  avatar?: string;
  /** User's email address */
  email: string;
  /** User's full name */
  name?: string;
  /** Custom container style */
  containerStyle?: ViewStyle;
  /** Callback when header is pressed */
  onPress?: () => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  avatar,
  email,
  name,
  containerStyle,
  onPress,
}) => {
  const colors = useColors();

  // Generate initials from name
  const initials = useMemo(() => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [name]);

  // Get avatar background color (deterministic from email)
  const avatarBgColor = useMemo(() => {
    const colors_array = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
    ];
    const hashCode = email
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors_array[hashCode % colors_array.length];
  }, [email]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        contentContainer: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        },
        avatar: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: avatarBgColor,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        },
        avatarImage: {
          width: '100%',
          height: '100%',
          borderRadius: 20,
        },
        initialsText: {
          fontSize: 14,
          fontWeight: '600',
          color: '#FFFFFF',
        },
        userInfo: {
          flex: 1,
        },
        nameText: {
          fontSize: 14,
          fontWeight: '600',
          color: colors.text,
          marginBottom: 2,
        },
        emailText: {
          fontSize: 12,
          color: colors.textSecondary,
        },
      }),
    [colors, avatarBgColor],
  );

  const content = (
    <View style={styles.contentContainer}>
      <View style={styles.avatar}>
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            style={styles.avatarImage}
            accessibilityLabel={`${name || 'User'} avatar`}
          />
        ) : (
          <Text style={styles.initialsText}>{initials}</Text>
        )}
      </View>
      <View style={styles.userInfo}>
        {name && <Text style={styles.nameText}>{name}</Text>}
        <Text
          style={styles.emailText}
          numberOfLines={1}
          ellipsizeMode="tail"
          accessibilityLabel={`Email: ${email}`}
        >
          {email}
        </Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        style={[styles.container, containerStyle]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`User profile: ${name || email}`}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, containerStyle]} accessible>
      {content}
    </View>
  );
};

export default UserHeader;
