import 'react-native-url-polyfill/auto';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './app/screens/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './app/screens/Home';
import { Button } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react-native-reanimated';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Компонент для Drawer Navigation
const DrawerNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Home" component={Home} />
  </Drawer.Navigator>
);

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut();
    };

  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <Stack.Screen
          name="DrawerNavigator" 
          component={DrawerNavigator} 
        />
        ) : (
          <>
            <Stack.Screen name="Login" component={Auth} />
            <Stack.Screen name="Register" component={Auth} />
          </>
          
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
