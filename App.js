import { StatusBar } from 'expo-status-bar'
import React, { Component } from 'react'
import { API_KEY } from '@env'
import { View, Text } from 'react-native'

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

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({ loggedIn: false, loaded: true })
      } else {
        this.setState({ loggedIn: true, loaded: true })
      }
    })
  }

  render() {
    const { loggedIn, loaded } = this.state

    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Loading...</Text>
        </View>
      )
    }

    if (!loggedIn) {
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

    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>User is logged in</Text>
      </View>
    )
  }
}

export default App
