import React from 'react';
import { TouchableOpacity, Dimensions, Image, View } from 'react-native';
import { Text, StyleSheet, FlatList } from 'react-native';

export default function Detail({ route }) {
  const { property } = route.params;
  const exchangeRate = 0.0023;
  const priceInDollars = property.price * exchangeRate;

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
        <View>
          <Text style={styles.priceTenge}>{property.price} тг.</Text>
          <Text style={styles.priceDollars}>~ ${priceInDollars.toFixed(2)}</Text>
        </View>
        <View>
          <Text style={[styles.title, {fontWeight: 'bold'}]}>{property.address}</Text>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => {}}>
            <Text style={styles.buttonText}>Показать на карте</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.propertyContainer}>
          <View style={[styles.propertyBlock, {flex: 1}]}>
            <Text style={[styles.propertyDetail, {fontWeight: 'bold'}]}>{property.area}</Text>
            <Text style={[styles.propertyDetail, {color: 'gray'}]}>общая</Text>
          </View>
          <View style={[styles.propertyBlock, {flex: 1}]}>
            <Text style={[styles.propertyDetail, {fontWeight: 'bold'}]}>{property.number_of_rooms} комн.</Text>
            <Text style={[styles.propertyDetail, {color: 'gray'}]}>квартиры</Text>
          </View>
          <View style={[styles.propertyBlock, {flex: 1}]}>
            <Text style={[styles.propertyDetail, {fontWeight: 'bold'}]}>5</Text>
            <Text style={[styles.propertyDetail, {color: 'gray'}]}>этаж</Text>
          </View>
        </View>
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Описание</Text>
          <Text style={styles.description}>{property.description}</Text>
        </View>
      </View>
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => {}}>
          <Text style={styles.buttonText}>Позвонить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 200,
  },
  textContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    flex: 1, // Добавляем flex: 1, чтобы занимать все доступное пространство
  },
  title: {
    fontSize: 20,
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
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  priceTenge: {
    fontSize: 23,
    color: '#587cff',
    marginBottom: 5,
  },
  priceDollars: {
    fontSize: 15,
    marginBottom: 10,
    color: 'gray',
  },
  propertyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  propertyBlock: {
    marginRight: 10,
  },
  propertyDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    backgroundColor: '#ffdb58',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomButtonContainer: {
    position: 'absolute', 
    bottom: 20, 
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
});
