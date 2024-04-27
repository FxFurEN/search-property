import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './app/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import Home from './app/screens/Home';
import Login from './app/screens/Login';
import { Button } from 'react-native';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
    </AuthProvider>
  );
}


export const Layout = () => {
  const {authState, onLogout} = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        { authState?.authenticated ? 
          <Stack.Screen 
            name="Home" 
            component={Home}
            options={{headerRight: () => <Button onPress={onLogout} title='Sign Out' />}} /> 
          : 
          <Stack.Screen name="Login" component={Login} />
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
};


