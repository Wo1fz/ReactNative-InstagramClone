import React, { Component } from 'react'
import { View, Button, TextInput, Text } from 'react-native'
import firebase from 'firebase'

export class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      errorMessage: '',
    }
    this.onSignIn = this.onSignIn.bind(this)
  }

  onSignIn() {
    const { email, password } = this.state
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result)
      })
      .catch((error) => {
        this.setState({ errorMessage: error.message })
      })
  }

  render() {
    return (
      <View>
        {this.state.errorMessage !== '' && (
          <Text
            style={{
              backgroundColor: 'red',
              color: 'white',
              padding: 5,
              textAlign: 'center',
            }}
          >
            {this.state.errorMessage}
          </Text>
        )}
        <TextInput
          placeholder='email'
          style={{
            height: '30px',
            borderWidth: '2',
            padding: '20px',
            margin: '2px',
          }}
          onChangeText={(email) => this.setState({ email })}
        />
        <TextInput
          placeholder='password'
          style={{
            height: '30px',
            borderWidth: '2',
            padding: '20px',
            margin: '2px',
          }}
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
        />
        <Button onPress={() => this.onSignIn()} title='Sign In' />
      </View>
    )
  }
}

export default Login
