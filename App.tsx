import 'react-native-url-polyfill/auto';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './app/screens/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './app/screens/Home';
import Profile from './app/screens/Profile';
import { Session } from '@supabase/supabase-js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react-native-reanimated';
import Register from './app/screens/Register';
import Login from './app/screens/Login';
import Ionicons from 'react-native-vector-icons/Ionicons'; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const signOut = async () => {
  await supabase.auth.signOut();
};

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    });

  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <Stack.Screen
            name="TabNavigator"
            component={TabNavigator}
          />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Поиск') {
          iconName = focused ? 'search' : 'search-outline'; 
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline'; 
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Поиск" component={Home} />
    <Tab.Screen name="Profile" component={Profile} />
  </Tab.Navigator>
);
