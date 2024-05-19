import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, ScrollView, Dimensions } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
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


const MAPQUEST_API_KEY = process.env.MAPQUEST_API_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

export default function Home({ navigation, route }) {
  const [properties, setProperties] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const { selectedCity, selectedPropertyType } = route.params;

  useEffect(() => {
    if (selectedCity && !selectedPropertyType) {
      filterByCity();
    } else if (!selectedCity && selectedPropertyType) {
      filterByPropertyType();
    } else if (selectedCity && selectedPropertyType) {
      filterByCityAndPropertyType();
    } else {
      loadProperties();
    }
  }, [selectedCity, selectedPropertyType]); 


  const loadProperties = async () => {
    let query = supabase.from('properties').select('*');
    const { data, error } = await query;
  
    if (error) {
      console.error('Ошибка получения данных:', error.message);
      return;
    }
  
    const updatedProperties = await Promise.all(
      data.map(async (property) => {
        try {
          const { address, city_id } = property;
          const { data: cityData, error: cityError } = await supabase.from('cities').select('city_name').eq('city_id', city_id).single();
          if (cityError) {
            console.error('Ошибка получения данных о городе:', cityError.message);
            return property;
          }
          const cityName = cityData.city_name;
          const fullAddress = `${address}, ${cityName}`;
          const response = await axios.get('https://www.mapquestapi.com/geocoding/v1/address', {
            params: {
              key: MAPQUEST_API_KEY,
              location: fullAddress,
              format: 'json',
            },
          });
          const { data: geocodeData } = response;
          if (geocodeData && geocodeData.results && geocodeData.results.length > 0) {
            const { lat, lng } = geocodeData.results[0].locations[0].latLng;
            const imageUrl = await getRandomImage();
            return {
              ...property,
              latitude: parseFloat(lat),
              longitude: parseFloat(lng),
              imageUrl
            };
          }
        } catch (error) {
          console.error('Ошибка при обновлении координат:', error.message);
        }
        return property;
      })
    );
    setProperties(updatedProperties);
  };

  const filterByCity = async () => {
    let query = supabase.from('properties').select('*').eq('city_id', selectedCity);;
    const { data, error } = await query;
  
    if (error) {
      console.error('Ошибка получения данных:', error.message);
      return;
    }
  
    const updatedProperties = await Promise.all(
      data.map(async (property) => {
        try {
          const { address, city_id } = property;
          const { data: cityData, error: cityError } = await supabase.from('cities').select('city_name').eq('city_id', city_id).single();
          if (cityError) {
            console.error('Ошибка получения данных о городе:', cityError.message);
            return property;
          }
          const cityName = cityData.city_name;
          const fullAddress = `${address}, ${cityName}`;
          const response = await axios.get('https://www.mapquestapi.com/geocoding/v1/address', {
            params: {
              key: MAPQUEST_API_KEY,
              location: fullAddress,
              format: 'json',
            },
          });
          const { data: geocodeData } = response;
          if (geocodeData && geocodeData.results && geocodeData.results.length > 0) {
            const { lat, lng } = geocodeData.results[0].locations[0].latLng;
            const imageUrl = await getRandomImage();
            return {
              ...property,
              latitude: parseFloat(lat),
              longitude: parseFloat(lng),
              imageUrl
            };
          }
        } catch (error) {
          console.error('Ошибка при обновлении координат:', error.message);
        }
        return property;
      })
    );
    setProperties(updatedProperties);
  };
  
  const filterByPropertyType = async () => {
    let query = supabase.from('properties').select('*').eq('type_id', selectedPropertyType);;
    const { data, error } = await query;
  
    if (error) {
      console.error('Ошибка получения данных:', error.message);
      return;
    }
  
    const updatedProperties = await Promise.all(
      data.map(async (property) => {
        try {
          const { address, city_id } = property;
          const { data: cityData, error: cityError } = await supabase.from('cities').select('city_name').eq('city_id', city_id).single();
          if (cityError) {
            console.error('Ошибка получения данных о городе:', cityError.message);
            return property;
          }
          const cityName = cityData.city_name;
          const fullAddress = `${address}, ${cityName}`;
          const response = await axios.get('https://www.mapquestapi.com/geocoding/v1/address', {
            params: {
              key: MAPQUEST_API_KEY,
              location: fullAddress,
              format: 'json',
            },
          });
          const { data: geocodeData } = response;
          if (geocodeData && geocodeData.results && geocodeData.results.length > 0) {
            const { lat, lng } = geocodeData.results[0].locations[0].latLng;
            const imageUrl = await getRandomImage();
            return {
              ...property,
              latitude: parseFloat(lat),
              longitude: parseFloat(lng),
              imageUrl
            };
          }
        } catch (error) {
          console.error('Ошибка при обновлении координат:', error.message);
        }
        return property;
      })
    );
    setProperties(updatedProperties);
  };
  
  const filterByCityAndPropertyType = async () => {
    let query = supabase.from('properties').select('*').eq('city_id', selectedCity).eq('type_id', selectedPropertyType);;
    const { data, error } = await query;
  
    if (error) {
      console.error('Ошибка получения данных:', error.message);
      return;
    }
  
    const updatedProperties = await Promise.all(
      data.map(async (property) => {
        try {
          const { address, city_id } = property;
          const { data: cityData, error: cityError } = await supabase.from('cities').select('city_name').eq('city_id', city_id).single();
          if (cityError) {
            console.error('Ошибка получения данных о городе:', cityError.message);
            return property;
          }
          const cityName = cityData.city_name;
          const fullAddress = `${address}, ${cityName}`;
          const response = await axios.get('https://www.mapquestapi.com/geocoding/v1/address', {
            params: {
              key: MAPQUEST_API_KEY,
              location: fullAddress,
              format: 'json',
            },
          });
          const { data: geocodeData } = response;
          if (geocodeData && geocodeData.results && geocodeData.results.length > 0) {
            const { lat, lng } = geocodeData.results[0].locations[0].latLng;
            const imageUrl = await getRandomImage();
            return {
              ...property,
              latitude: parseFloat(lat),
              longitude: parseFloat(lng),
              imageUrl
            };
          }
        } catch (error) {
          console.error('Ошибка при обновлении координат:', error.message);
        }
        return property;
      })
    );
    setProperties(updatedProperties);
  };
  

  const getRandomImage = async () => {
    try {
      const response = await axios.get(`https://api.pexels.com/v1/search?query=$property&per_page=5`, {
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
        <Button
          icon={<Ionicons name="location-outline" size={24} color="black" />} 
          title="Поиск"
          buttonStyle={styles.searchButton}
          titleStyle={styles.searchButtonText} 
          containerStyle={{width: '70%'}}
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
              >
                <Icon
                  name='circle'
                  type='font-awesome'
                  color='#191508'
                />
              </Marker>
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
                  <Button title="Подробнее" 
                    buttonStyle={[styles.button, styles.modalButton]} 
                    titleStyle={styles.modalButtonText} 
                    onPress={() => {
                      navigation.navigate('Detail', { 
                        selectedProperty: selectedProperty
                      });
                      setModalVisible(false);
                    }} 
                  />
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
  searchButton: {
    marginLeft: 10,
    height: '70%',
    marginRight: 10, 
    borderRadius: 10, 
    borderWidth: 2, 
    borderColor: 'gray', 
    backgroundColor: 'transparent',
    paddingLeft: 10, 
    paddingRight: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start', 
  },
  searchButtonText: {
    color: 'black',
    textAlign: 'left',
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
