import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Detail({ route }) {
  const { property } = route.params;
  console.log(property);
  if (!property) {
    return (
      <View style={styles.container}>
        <Text>Данные о свойстве отсутствуют</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{property.title}</Text>
      <Text style={styles.description}>{property.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
  },
});
