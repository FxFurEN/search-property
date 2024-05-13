import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, ScrollView, Dimensions } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import { supabase } from '../../lib/supabase';
import PropertyDetails from '../components/PropertyDetails'; 
import { FlatList } from 'react-native';

const INITIAL_REGION={
  latitude: 51.2239,
  longitude: 51.3707,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
}


const PEXELS_API_KEY = 'JDq6F6ESipIJtHhxozCLqrF6rHVQBp33S55ajLGewoA31VUdBU2ONmUF';

export default function Home({ navigation }) {
  const [properties, setProperties] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const { data, error } = await supabase.from('properties').select('property_id, title, description, address, city_id');
    if (error) {
      console.error('Ошибка получения данных:', error.message);
    } else {
      const updatedProperties = await Promise.all(
        data.map(async (property) => {
          try {
            // Получаем адрес и город из данных
            const { address, city_id } = property;
            // Получаем имя города из базы данных
            const { data: cityData, error: cityError } = await supabase.from('cities').select('city_name').eq('city_id', city_id).single();
            if (cityError) {
              console.error('Ошибка получения данных о городе:', cityError.message);
              return property;
            }
            const cityName = cityData.city_name;
            // Формируем строку с адресом, включающую и город
            const fullAddress = `${address}, ${cityName}`;
            // Отправляем запрос на геокодирование
            const { data: geocodeData } = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=1`);
            if (geocodeData && geocodeData.length > 0) {
              const { lat, lon } = geocodeData[0];
              const imageUrl = await getRandomImage();
              return {
                ...property,
                latitude: parseFloat(lat),
                longitude: parseFloat(lon),
                imageUrl
              };
            }
          } catch (error) {
            console.error('Ошибка при обновлении координат:', error.message);
          }
          // Возвращаем исходное свойство в случае ошибки
          return property;
        })
      );
      setProperties(updatedProperties);
    }
  };

  const getRandomImage = async () => {
    try {
      const response = await axios.get(`https://api.pexels.com/v1/curated?per_page=5`, {
        headers: {
          Authorization: PEXELS_API_KEY
        }
      });
      if (response.data && response.data.photos && response.data.photos.length > 0) {
        return response.data.photos.map(photo => photo.src.large);
      } else {
        console.error('Ошибка получения изображений с Pexels:', response);
        return [];
      }
    } catch (error) {
      console.error('Ошибка получения изображений с Pexels:', error.message);
      return [];
    }
  };

  const openModal = (property) => {
    setSelectedProperty(property);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Input
          placeholder="Поиск"
          leftIcon={<Ionicons name="location-outline" size={24} color="black" />} 
          inputContainerStyle={styles.inputContainer} 
          inputStyle={styles.input} 
          autoCapitalize={'none'}
          containerStyle={{width: '70%' }}
        />
        <Button
          icon={<Ionicons name="options-outline" size={24} color="black" />} 
          title="Фильтр" 
          buttonStyle={[styles.button, styles.transparentButton]}
          titleStyle={{ color: 'black', marginLeft: 8 }} 
          iconContainerStyle={{ marginRight: 8 }} 
          onPress={() => navigation.navigate('Filter', { screen: 'Filter' })}
        />
      </View>
      <View style={styles.mapContainer}>
        <MapView 
          style={styles.map} 
          provider={PROVIDER_GOOGLE} 
          initialRegion={INITIAL_REGION}
          showsUserLocation
        >
          {properties.map((property, index) => (
            property.latitude && property.longitude ? (
              <Marker
                key={index}
                coordinate={{ latitude: property.latitude, longitude: property.longitude }}
                onPress={() => openModal(property)}
              />
            ) : null
          ))}
        </MapView>
      </View>
      <PropertyDetails isVisible={isModalVisible} onClose={() => setModalVisible(false)}>
        {selectedProperty && (
          <>
            <FlatList
                style={styles.imageList}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={selectedProperty.imageUrl}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.slide}>
                    <Image source={{ uri: item }} style={styles.image} />
                  </View>
                )}
              />
            <ScrollView>
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyTitle}>{selectedProperty.title}</Text>
                <Text style={styles.propertyDescription}>{selectedProperty.description}</Text>
              </View>
              <View style={styles.buttonContainer}>
                  <Button title="Подробнее" buttonStyle={[styles.button, styles.modalButton]} titleStyle={styles.modalButtonText} onPress={() => {/* Действие при нажатии */}} />
                  <Button title="Позвонить" buttonStyle={[styles.button, styles.modalButton]} titleStyle={styles.modalButtonText} onPress={() => {/* Действие при нажатии */}} />
              </View>
            </ScrollView>
          </>
        )}
      </PropertyDetails>
    </View>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    marginTop: 30,
  },
  row: {
    alignItems: 'center',
    height: 60, 
    flexDirection: 'row', 
  },
  inputContainer: { 
    marginTop: 25,
    height: '70%',
    marginRight: 10, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: 'gray', 
    paddingLeft: 10, 
    paddingRight: 10,
  },
  input: {
    marginLeft: 10, 
  },
  button: {
    borderRadius: 10,
    width: 100, 
    height: '70%'
  },
  modalButton: {
    backgroundColor: '#ffdb58',
    width: 160,
  },
  modalButtonText: {
    color: 'black',
  },  
  transparentButton: {
    backgroundColor: 'transparent',
    borderWidth: 0, 
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
  map: {
    flex: 1,
  },  
  slide: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageList: {
    height: 200, 
  },
  
  image: {
    width: '90%',
    height: '90%',
    borderRadius: 10,
  },
  propertyInfo: {
    padding: 10,
  },
  propertyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  propertyDescription: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
});
