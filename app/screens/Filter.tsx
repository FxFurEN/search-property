import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Filter() {
  return (
    <View style={styles.container}>
      <Text>Это экран с фильтрами</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
