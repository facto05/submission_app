/**
 * User card component
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { User } from '../../domain/entities/user';

interface UserCardProps {
  user: User;
  onPress?: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
  return (
    <View style={styles.container}>
      {user.avatar && (
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
      )}
      <View style={styles.content}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  email: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
