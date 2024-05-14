import React from 'react';
import { Dimensions, Image } from 'react-native';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function Detail({ route }) {
  const { property } = route.params;
  if (!property) {
    return (
      <View style={styles.container}>
        <Text>Данные о свойстве отсутствуют</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <FlatList
          style={styles.imageList}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={property.imageUrl}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Image source={{ uri: item }} style={styles.image} />
            </View>
          )}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.description}>Цена: {property.price}</Text>
        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.description}>{property.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    alignItems: 'center',
  },
  imageContainer: {
    height: 200,
  },
  textContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  slide: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
  imageList: {
    height: '100%',
  },
  image: {
    width: '90%',
    height: '100%',
    borderRadius: 10,
  },
});
