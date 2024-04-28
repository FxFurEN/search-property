import 'react-native-url-polyfill/auto';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './app/screens/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './app/screens/Home';
import Profile from './app/screens/Profile';
import { Button, View } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { DrawerContentScrollView, DrawerItem, createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react-native-reanimated';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const signOut = async () => {
  await supabase.auth.signOut();
  };

  const DrawerContent = (props) => {
    return (
      <>
      <DrawerContentScrollView {...props}>
        <DrawerItem
          label="Главная"
          onPress={() => props.navigation.navigate('Home')}
        />  
        <DrawerItem
          label="Профиль"
          onPress={() => props.navigation.navigate('Profile')}
        /> 
      </DrawerContentScrollView>
      <View style={{ borderTopWidth: 1, borderTopColor: '#ddd' }}>
      <DrawerItem
        label="Выйти"
        onPress={signOut}
      />
      </View>
      </>
      
    );
  };


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

const DrawerNavigator = () => (
  <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
    <Drawer.Screen name="Home" component={Home} />
    <Drawer.Screen name="Profile" component={Profile} />
  </Drawer.Navigator>
);