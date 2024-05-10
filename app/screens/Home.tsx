import { View, Text, StyleSheet } from 'react-native'
import { Button, Input } from 'react-native-elements'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'; 

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Input
          placeholder="Поиск"
          leftIcon={<Ionicons name="location-outline" size={24} color="black" />} 
          inputContainerStyle={styles.inputContainer} 
          inputStyle={styles.input} 
          autoCapitalize={'none'}
          containerStyle={{ height: 70 }}
        />
        <Button
          icon={<Ionicons name="options-outline" size={24} color="black" />} 
          title="Фильтр" 
          buttonStyle={[styles.button, styles.transparentButton]}
          titleStyle={{ color: 'black', marginLeft: 8 }} 
          iconContainerStyle={{ marginRight: 8 }} 
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '70%',
    marginTop: 30,
  },
  row: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
  },
  inputContainer: {
    flex: 1, 
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
    height: 45,
  },
  transparentButton: {
    backgroundColor: 'transparent', // Сделать фон кнопки прозрачным
    borderWidth: 0, // Убрать границы кнопки
  },
})
