import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import firebase from 'firebase'
require('firebase/firestore')

export default function Comment(props) {
  const [comments, setComments] = useState([])
  const [postId, setPostId] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    if (props.route.params.postId !== postId) {
      firebase
        .firestore()
        .collection('posts')
        .doc(props.route.params.uid)
        .collection('userPosts')
        .doc(props.route.params.postId)
        .collection('comments')
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map((doc) => {
            const data = doc.data()
            const id = doc.id
            return { id, ...data }
          })
          setComments(comments)
        })
      setPostId(props.route.params.postId)
    }
  }, [props.route.params.postId])

  const onCommentSend = () => {
    firebase
      .firestore()
      .collection('posts')
      .doc(props.route.params.uid)
      .collection('userPosts')
      .doc(props.route.params.postId)
      .collection('comments')
      .add({
        creator: firebase.auth().currentUser.uid,
        text,
      })
  }

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={props.route.params.user.profilePic}
          style={styles.profilePic}
        />
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('Profile', {
              uid: props.user.uid,
            })
          }
        >
          <Text style={styles.name}>{props.route.params.user.name}</Text>
        </TouchableOpacity>
      </View>
      <Image
        style={styles.image}
        source={{ uri: props.route.params.downloadURL }}
      />
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('Profile', {
              uid: props.route.params.user.uid,
            })
          }
        >
          <Text style={styles.captionUID}>{props.route.params.user.name}</Text>
        </TouchableOpacity>
        <Text style={styles.caption}>{props.route.params.caption}</Text>
      </View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.comments}>{item.text}</Text>
          </View>
        )}
      />
      <View>
        <TextInput
          placeholder='Add a comment...'
          style={styles.commentBox}
          onChangeText={(text) => setText(text)}
        />
        <Button onPress={() => onCommentSend()} title='Send' />
      </View>
    </View>
  )
}

const win = Dimensions.get('window')
const picture = win.width

const styles = StyleSheet.create({
  profilePic: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginLeft: '7px',
    marginTop: '6px',
    marginBottom: '5px',
    marginLeft: '15px',
  },
  name: {
    flex: 1,
    color: 'black',
    fontSize: '18px',
    margin: '10px',
  },
  image: {
    aspectRatio: 1 / 1,
    width: picture,
    height: picture - 110,
    marginBottom: 1,
  },
  caption: {
    flex: 1,
    marginLeft: '7px',
    marginBottom: '7px',
    fontSize: '16px',
  },
  captionUID: {
    fontSize: '16px',
    marginLeft: '10px',
    fontWeight: 'bold',
  },
  comments: {
    fontSize: '17px',
    marginLeft: '10px',
  },
  commentBox: {
    fontSize: '17px',
    padding: '10px',
  },
})
