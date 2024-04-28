import 'react-native-url-polyfill/auto';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './app/screens/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './app/screens/Home';
import { Button } from 'react-native';
import { Session } from '@supabase/supabase-js';

const Stack = createNativeStackNavigator();

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
    <NavigationContainer>
      <Stack.Navigator>
        {session ? (
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerRight: () => <Button  onPress={signOut} title="Выйти" />,
            }}
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
