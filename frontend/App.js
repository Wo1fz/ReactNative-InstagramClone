import { StatusBar } from 'expo-status-bar'
import React, { Component } from 'react'
import { API_KEY, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID } from '@env'
import { View, Text } from 'react-native'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'

const store = createStore(rootReducer, applyMiddleware(thunk))

import firebase from 'firebase'

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: 'instagram-clone-9b35f.firebaseapp.com',
  projectId: 'instagram-clone-9b35f',
  storageBucket: 'instagram-clone-9b35f.appspot.com',
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
}

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'
import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'
import CommentScreen from './components/main/Comment'

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
            <Stack.Screen name='Login' component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      )
    }

    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='PicMe'>
            <Stack.Screen
              name='PicMe'
              component={MainScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name='Add'
              component={AddScreen}
              options={{ headerShown: false }}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name='Save'
              component={SaveScreen}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name='Comment'
              component={CommentScreen}
              navigation={this.props.navigation}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App
