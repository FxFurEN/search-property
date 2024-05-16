import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase'; // Предполагается, что у вас есть модуль supabase для взаимодействия с базой данных

export default function Location() {
  const [city, setCity] = useState(''); // Состояние для введенного города
  const [cities, setCities] = useState([]); // Состояние для списка доступных городов из базы данных
  const [filteredCities, setFilteredCities] = useState([]); // Состояние для отфильтрованных городов

  useEffect(() => {
    fetchCities(); // Загрузка списка городов при загрузке компонента
  }, []);

  // Функция для загрузки списка городов из базы данных
  const fetchCities = async () => {
    try {
      const { data, error } = await supabase.from('cities').select('city_name');
      if (error) {
        console.error('Ошибка получения городов:', error.message);
      } else {
        setCities(data);
        setFilteredCities(data); // Установка начального списка городов
      }
    } catch (error) {
      console.error('Ошибка получения городов:', error.message);
    }
  };

  // Функция для фильтрации городов по введенному тексту
  const filterCities = (text) => {
    const filtered = cities.filter(city => city.city_name.toLowerCase().includes(text.toLowerCase()));
    setFilteredCities(filtered);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Введите город"
        value={city}
        onChangeText={(text) => {
          setCity(text);
          filterCities(text); // Фильтрация городов при изменении текста в поле ввода
        }}
      />
      <FlatList
        data={filteredCities}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setCity(item.city_name)}>
            <Text style={styles.city}>{item.city_name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  city: {
    fontSize: 18,
    marginBottom: 10,
  },
});
