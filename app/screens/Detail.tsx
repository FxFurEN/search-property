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

  // Определяем, является ли недвижимость типом "Гараж"
  const isGarage = property.type_id === 3;

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <FlatList
          style={styles.imageList}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={property.photos}
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
          <Text style={[styles.title, {fontWeight: 'bold'}]}>{property.title}</Text>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => {}}>
            <Text style={styles.buttonText}>Показать на карте</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.propertyContainer}>
          {/* Отображаем информацию о площади, количестве комнат и этаже для квартир */}
          {property.category_id === 1 && !isGarage && (
            <>
              <View style={styles.propertyBlock}>
                <Text style={styles.propertyDetail}>{property.area} м²</Text>
                <Text style={styles.propertyDetail}>Общая площадь</Text>
              </View>
              <View style={styles.propertyBlock}>
                <Text style={styles.propertyDetail}>{property.number_of_rooms} комн.</Text>
                <Text style={styles.propertyDetail}>Количество комнат</Text>
              </View>
              <View style={styles.propertyBlock}>
                <Text style={styles.propertyDetail}>{property.floor_number} из {property.number_of_floors}</Text>
                <Text style={styles.propertyDetail}>Этаж</Text>
              </View>
            </>
          )}
          {/* Отображаем информацию о площади участка и строения для частных домов */}
          {property.category_id === 2 && !isGarage && (
            <>
              <View style={styles.propertyBlock}>
                <Text style={styles.propertyDetail}>{property.land_area} сот.</Text>
                <Text style={styles.propertyDetail}>Площадь участка</Text>
              </View>
              <View style={styles.propertyBlock}>
                <Text style={styles.propertyDetail}>{property.building_area} м²</Text>
                <Text style={styles.propertyDetail}>Площадь строения</Text>
              </View>
              <View style={styles.propertyBlock}>
                <Text style={styles.propertyDetail}>{property.number_of_rooms}</Text>
                <Text style={styles.propertyDetail}>Кол-во жилый комнат</Text>
              </View>
            </>
          )}
          {/* Отображаем информацию о площади склада для складов */}
          {property.category_id === 4 || property.category_id === 5 && (
            <View style={styles.propertyBlock}>
              <Text style={styles.propertyDetail}>{property.warehouse_area} м²</Text>
              <Text style={styles.propertyDetail}>Площадь склада</Text>
            </View>
          )}
          {property.category_id === 3 && (
            <>
              <View style={styles.propertyBlock}>
                <Text style={styles.propertyDetail}>{property.number_of_floors}</Text>
                <Text style={styles.propertyDetail}>Этаж</Text>
              </View>
              <View style={styles.propertyBlock}>
                <Text style={styles.propertyDetail}>{property.floor_number}</Text>
                <Text style={styles.propertyDetail}>Кол-во комнат</Text>
              </View>
              <View style={styles.propertyBlock}>
                <Text style={styles.propertyDetail}>{property.building_area} м²</Text>
                <Text style={styles.propertyDetail}>Площадь строения</Text>
              </View>
            </>
            
            
          )}
          {/* Отображаем информацию о количестве парковочных мест для гаражей и машиномест */}
          {(property.category_id === 6 || property.category_id === 7) && (
            <View style={styles.propertyBlock}>
              <Text style={styles.propertyDetail}>{property.parking_spaces}</Text>
              <Text style={styles.propertyDetail}>Парковочные места</Text>
            </View>
          )}
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
    flex: 1,
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
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 20,
  },
  propertyBlock: {
    width: '48%',
    marginBottom: 10,
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
