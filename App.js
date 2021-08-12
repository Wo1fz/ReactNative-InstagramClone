import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { API_KEY } from 'react-native-dotenv'

import firebase from 'firebase'
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: 'instagram-clone-9b35f.firebaseapp.com',
  projectId: 'instagram-clone-9b35f',
  storageBucket: 'instagram-clone-9b35f.appspot.com',
  messagingSenderId: '522226968827',
  appId: '1:522226968827:web:01780eeb9fa19261b4685e',
  measurementId: 'G-RB21SW8MTF',
}
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Landing'>
        <Stack.Screen
          name='Landing'
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name='Register' component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
