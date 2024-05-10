import { View, Text, StyleSheet,  } from 'react-native'
import { Button, Input } from 'react-native-elements'
import React, { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'

export default function Profile() {
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
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Почта"
          autoCapitalize={'none'}
          value={session?.user.email}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Телефон"
          autoCapitalize={'none'}
          value={session?.user.phone}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Сохранить" />
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      marginTop: 40,
      padding: 12,
    },
    verticallySpaced: {
      paddingTop: 4,
      paddingBottom: 4,
      alignSelf: 'stretch',
    },
    mt20: {
      marginTop: 20,
    },
  })