import React from 'react'
import { View, Button, ImageBackground } from 'react-native'

export default function Landing({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
      }}
    >
      <ImageBackground
        source={require('../../assets/background.jpeg')}
        resizeMode='cover'
        style={{ flex: 1, justifyContent: 'center' }}
      >
        <Button
          title='Register'
          onPress={() => navigation.navigate('Register')}
        />
        <Button title='Login' onPress={() => navigation.navigate('Login')} />
      </ImageBackground>
    </View>
  )
}
