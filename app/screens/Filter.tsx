import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Slider, ButtonGroup } from 'react-native-elements';
import { supabase } from '../../lib/supabase';

export default function Filter() {
  const [cities, setCities] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000000]); // Диапазон цен по умолчанию
  const [searchText, setSearchText] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCityList, setShowCityList] = useState(false); // Состояние для отображения списка городов

  useEffect(() => {
    fetchCities();
    fetchPropertyTypes();
  }, []);

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase.from('cities').select('city_name');
      if (error) {
        console.error('Ошибка получения городов:', error.message);
      } else {
        setCities(data.map(city => city.city_name));
      }
    } catch (error) {
      console.error('Ошибка при загрузке городов:', error.message);
    }
  };

  const fetchPropertyTypes = async () => {
    try {
      const { data, error } = await supabase.from('propertytypes').select('type_name');
      if (error) {
        console.error('Ошибка получения типов недвижимости:', error.message);
      } else {
        setPropertyTypes(data.map(type => type.type_name));
      }
    } catch (error) {
      console.error('Ошибка при загрузке типов недвижимости:', error.message);
    }
  };

  const propertyTypeButtons = propertyTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1));

  // Функция для выбора города из списка и установки его в поле ввода
  const selectCity = (city) => {
    setSelectedCity(city);
    setSearchText(city); // Устанавливаем выбранный город в поле ввода
    setShowCityList(false); // Скрываем список городов
  };

  // Функция для фильтрации городов в зависимости от введенного текста
  const filterCities = (text) => {
    setSearchText(text);
    const filtered = cities.filter(city => city.toLowerCase().includes(text.toLowerCase()));
    setFilteredCities(filtered);
    setShowCityList(true); // Показываем список городов при вводе текста
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Фильтр</Text>
      <View style={styles.filter}>
        <Text style={styles.label}>Город:</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите город"
          onChangeText={filterCities}
          value={searchText}
        />
        {showCityList && (
          <FlatList
            data={filteredCities}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectCity(item)} style={styles.buttonContainer}>
                <Text style={styles.buttonText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        )}
      </View>
      <View style={styles.filter}>
        <Text style={styles.label}>Тип недвижимости:</Text>
        <ButtonGroup
          buttons={propertyTypeButtons}
          selectedIndex={propertyTypeButtons.indexOf(selectedPropertyType)}
          onPress={(selectedIndex) => setSelectedPropertyType(propertyTypes[selectedIndex])}
          containerStyle={{ height: 40, borderWidth: 0 }}
          buttonStyle={{ backgroundColor: '#ffffff', borderRadius: 10 }}
          selectedButtonStyle={{ backgroundColor: '#ffdb58' }}
          textStyle={{ color: 'black' }}
          selectedTextStyle={{ color: 'black' }}
        />
      </View>
      <View style={styles.filter}>
        <Text style={styles.label}>Цена:</Text>
        <Text>{priceRange[0]} тг - {priceRange[1]} тг</Text>
        {/* Добавьте здесь компонент Slider */}
      </View>
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: '#ffdb58'}]} onPress={() => {}}>
          <Text style={[styles.buttonText, {textAlign: 'center'}]}>Поиск</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filter: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  buttonContainer: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  bottomButtonContainer: {
    position: 'absolute', 
    bottom: 20, 
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
});
