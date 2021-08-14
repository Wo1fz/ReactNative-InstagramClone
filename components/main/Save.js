import React, { useState } from 'react'
import { View, TextInput, Image, Button } from 'react-native'
import firebase from 'firebase'
require('firebase/firestore')
require('firebase/firebase-storage')

export default function Save(props, navigation) {
  const [caption, setCaption] = useState('')

  const uploadImage = async () => {
    const uri = props.route.params.image
    const childPath = `post/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`

    const response = await fetch(uri)
    const blob = await response.blob()

    const task = firebase.storage().ref().child(childPath).put(blob)

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`)
    }

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot)
      })
    }

    const taskError = (snapshot) => {
      console.log(snapshot)
    }

    task.on('state_change', taskProgress, taskError, taskCompleted)
  }

  const savePostData = (downloadURL) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(firebase.auth().currentUser.uid)
      .collection('userPosts')
      .add({
        downloadURL,
        caption,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        props.navigation.popToTop()
      })
  }

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={{ uri: props.route.params.image }}
        style={{ flex: 1, aspectRatio: 1 }}
      />
      <TextInput
        placeholder='Write a caption...'
        style={{
          height: '30px',
          borderWidth: '2',
          padding: '20px',
        }}
        onChangeText={(caption) => setCaption(caption)}
      />
      <Button title='Save' onPress={() => uploadImage()} />
    </View>
  )
}
