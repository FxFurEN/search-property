import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Slider, ButtonGroup } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Импортируем AsyncStorage
import { supabase } from '../../lib/supabase';

export default function Filter({ navigation }) {
  const [cities, setCities] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [searchText, setSearchText] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCityList, setShowCityList] = useState(false);

  useEffect(() => {
    fetchCities();
    fetchPropertyTypes();
  }, []);

  useEffect(() => {
    if (resetFilters) {
      resetFilters();
      navigation.setParams({ resetFilters: false }); // Сбрасываем параметр
    }
  }, [resetFilters, navigation]);

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase.from('cities').select('city_name, city_id');
      if (error) {
        console.error('Ошибка получения городов:', error.message);
      } else {
        setCities(data.map(city => ({ city_id: city.city_id, city_name: city.city_name })));
      }
    } catch (error) {
      console.error('Ошибка при загрузке городов:', error.message);
    }
  };
  
  const fetchPropertyTypes = async () => {
    try {
      const { data, error } = await supabase.from('propertytypes').select('type_name, type_id');
      if (error) {
        console.error('Ошибка получения типов недвижимости:', error.message);
      } else {
        setPropertyTypes(data.map(type => ({ type_id: type.type_id, type_name: type.type_name })));
      }
    } catch (error) {
      console.error('Ошибка при загрузке типов недвижимости:', error.message);
    }
  };
  
  const selectCity = (city) => {  
    setSelectedCity(city.city_id);
    setSearchText(city.city_name);
    setShowCityList(false);
  };

  const filterCities = (text) => {
    setSearchText(text);
    const filtered = cities.filter(city => city.city_name.toLowerCase().includes(text.toLowerCase()));
    setFilteredCities(filtered);
    setShowCityList(true);
  };

  const resetFilters = () => {
    setSelectedCity(null);
    setSelectedPropertyType(null);
    setPriceRange([0, 1000000]);
    setSearchText('');
  };

  const selectPropertyType = (index) => {  
    setSelectedPropertyType(propertyTypes[index].type_name);
  };

  const propertyTypeButtons = propertyTypes.map(type => type.type_name.charAt(0).toUpperCase() + type.type_name.slice(1));

  const getPropertyTypeIdByName = (typeName) => {
    const propertyType = propertyTypes.find(type => type.type_name === typeName);
    return propertyType ? propertyType.type_id : null;
  };

  const handleSearch = () => {
    const selectedPropertyTypeId = getPropertyTypeIdByName(selectedPropertyType);
    navigation.navigate('TabNavigator', {
      screen: 'Поиск',
      params:{
        selectedCity: selectedCity,
        selectedPropertyType: selectedPropertyTypeId,
      }
    });
  };

  // Функция для сохранения выбранных фильтров в AsyncStorage
  const saveFilters = async () => {
    try {
      await AsyncStorage.setItem('selectedFilters', JSON.stringify({ selectedCity, selectedPropertyType, priceRange, searchText }));
    } catch (error) {
      console.error('Ошибка сохранения фильтров:', error.message);
    }
  };

  // Функция для загрузки выбранных фильтров из AsyncStorage
  const loadFilters = async () => {
    try {
      const savedFilters = await AsyncStorage.getItem('selectedFilters');
      if (savedFilters !== null) {
        const { selectedCity, selectedPropertyType, priceRange, searchText } = JSON.parse(savedFilters);
        setSelectedCity(selectedCity);
        setSelectedPropertyType(selectedPropertyType);
        setPriceRange(priceRange);
        setSearchText(searchText);
      }
    } catch (error) {
      console.error('Ошибка загрузки фильтров:', error.message);
    }
  };

  useEffect(() => {
    loadFilters(); // Вызываем loadFilters при загрузке компонента
  }, []);

  useEffect(() => {
    saveFilters(); // Вызываем saveFilters при изменении выбранных фильтров
  }, [selectedCity, selectedPropertyType, priceRange, searchText]);

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
                <Text style={styles.buttonText}>{item.city_name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.city_id.toString()}
          />
        )}
      </View>
      <View style={styles.filter}>
        <Text style={styles.label}>Тип недвижимости:</Text>
        <ButtonGroup
          buttons={propertyTypeButtons}
          selectedIndex={propertyTypeButtons.indexOf(selectedPropertyType)}
          onPress={selectPropertyType}
          containerStyle={{ height: 40, borderWidth: 0 }}
          buttonStyle={{ backgroundColor: '#ffffff', borderRadius: 10 }}
          selectedButtonStyle={{ backgroundColor: '#ffdb58' }}
          textStyle={{ color: 'black' }}
          selectedTextStyle={{ color: 'black' }}
        />
      </View>
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: '#ffdb58'}]} onPress={handleSearch}>
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
