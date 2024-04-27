import { View, TextInput, Button, StyleSheet } from 'react-native'
import React from 'react'
import { useAuth } from '../context/AuthContext';

export default function Login() {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const {onLogin, onRegister} = useAuth();
  
  const login = async () => {
    const result = await onLogin!(email, password);
    if(result && result.error){
      alert(result.msg);
  }}

  const register = async () => {
    const result = await onRegister!(email, password);
    if(result && result.error){
      alert(result.msg);
    }else{
      login();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
          <TextInput 
            style={styles.input} 
            placeholder='Email' 
            value={email} 
            onChangeText={(text: string) => setEmail(text)} />
          <TextInput 
            style={styles.input} 
            placeholder='Password' 
            value={password} 
            secureTextEntry={true}
            onChangeText={(text: string) => setPassword(text)} />
          <Button title='Login' onPress={login} />
          <Button title='Register' onPress={register} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
   alignItems: 'center',
   justifyContent: 'center',
   flex: 1,
   width: '100%',
  },
  form: {
    gap: 10,
    width: '60%',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: 'white',
  }
});