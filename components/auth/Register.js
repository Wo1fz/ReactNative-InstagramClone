import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native'
import firebase from 'firebase'

export class Register extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      name: '',
    }
    this.onSignUp = this.onSignUp.bind(this)
  }

  onSignUp() {
    const { email, password, name } = this.state

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        firebase
          .firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .set({
            name,
            email,
          })
        console.log(result)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder='name'
          style={{
            height: '30px',
            borderWidth: '2',
            padding: '20px',
            margin: '2px',
          }}
          onChangeText={(name) => this.setState({ name })}
        />
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

        <Button onPress={() => this.onSignUp()} title='Sign Up' />
      </View>
    )
  }
}

export default Register
