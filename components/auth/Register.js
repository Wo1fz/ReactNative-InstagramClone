import React, { Component } from 'react'
import { View, Button, TextInput, Text, Image } from 'react-native'
import firebase from 'firebase'
import * as ImagePicker from 'expo-image-picker'

export class Register extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      name: '',
      errorMessage: '',
      profilePic: null,
    }
    this.onSignUp = this.onSignUp.bind(this)
  }

  onSignUp() {
    const { email, password, name, profilePic } = this.state

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
            profilePic,
          })
      })
      .catch((error) => {
        this.setState({ errorMessage: error.message })
      })
  }

  async uploadProfilePicture() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.cancelled) {
      this.setState({ profilePic: result.uri })
    }
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
        {this.state.profilePic === null ? (
          <View>
            <Image
              source={require('../../assets/blankProfile.png')}
              style={{
                flex: 1,
                width: 100,
                height: 100,
                borderRadius: 50,
                margin: '10px',
              }}
            />
            <Text
              style={{
                marginLeft: '18px',
                marginBottom: '20px',
              }}
              onPress={() => this.uploadProfilePicture()}
            >
              Upload Image
            </Text>
          </View>
        ) : (
          <View>
            <Image
              source={{ uri: this.state.profilePic }}
              style={{
                flex: 1,
                width: 100,
                height: 100,
                borderRadius: 50,
                margin: '10px',
              }}
            />
            <Text
              style={{
                marginLeft: '18px',
                marginBottom: '20px',
              }}
              onPress={() => this.uploadProfilePicture()}
            >
              Upload Image
            </Text>
          </View>
        )}
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
