import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Slider, ButtonGroup } from 'react-native-elements';
import { supabase } from '../../lib/supabase';

export default function Filter({ navigation }) {
  const [cities, setCities] = useState<{ city_id: number; city_name: string; }[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<{ type_id: number; type_name: string; }[]>([]);
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
  

  // Функция для выбора города из списка и установки его в поле ввода
  const selectCity = (city) => {  
    setSelectedCity(city.city_id);
    setSearchText(city.city_name);
    setShowCityList(false); // Скрываем список городов
  };

  // Функция для фильтрации городов в зависимости от введенного текста
  const filterCities = (text) => {
    setSearchText(text);
    const filtered = cities.filter(city => city.city_name.toLowerCase().includes(text.toLowerCase()));
    setFilteredCities(filtered);
    setShowCityList(true); // Show the city list when text is entered
  };

  // Функция для выбора типа недвижимости и установки его
  const selectPropertyType = (index) => {  
    setSelectedPropertyType(propertyTypes[index].type_name); // Set the selected property type name
  };

  // Возвращаемое значение из map должно содержать только имя типа недвижимости, а не всю информацию о типе недвижимости
  const propertyTypeButtons = propertyTypes.map(type => type.type_name.charAt(0).toUpperCase() + type.type_name.slice(1));


  const getPropertyTypeIdByName = (typeName) => {
    const propertyType = propertyTypes.find(type => type.type_name === typeName);
    return propertyType ? propertyType.type_id : null;
  };


  const handleSearch = () => {
  const selectedPropertyTypeId = getPropertyTypeIdByName(selectedPropertyType); // Get the ID by name
  navigation.navigate('TabNavigator', {
    screen: 'Поиск',
    params:{
      selectedCity: selectedCity,
      selectedPropertyType: selectedPropertyTypeId, // Pass the ID
    }
  });
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
                <Text style={styles.buttonText}>{item.city_name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.city_id.toString()} // Ensure unique keys
          />
        )}
      </View>
      <View style={styles.filter}>
        <Text style={styles.label}>Тип недвижимости:</Text>
        <ButtonGroup
          buttons={propertyTypeButtons}
          selectedIndex={propertyTypeButtons.indexOf(selectedPropertyType)}
          onPress={selectPropertyType} // Pass the selectPropertyType function
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
