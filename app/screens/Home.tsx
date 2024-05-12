import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import React, { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import { supabase } from '../../lib/supabase';

const INITIAL_REGION={
  latitude: 51.2239,
  longitude: 51.3707,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
}

const onMarkerPress=()=>{
  Alert.alert('onMarkerPress')
}

export default function Home({ navigation }) {
  const [properties, setProperties] = useState([]);

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
              return {
                ...property,
                latitude: parseFloat(lat),
                longitude: parseFloat(lon)
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
                title={property.title}
                description={property.description}
              />
            ) : null
          ))}
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  transparentButton: {
    backgroundColor: 'transparent',
    borderWidth: 0, 
  },
  mapContainer: {
    width: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
