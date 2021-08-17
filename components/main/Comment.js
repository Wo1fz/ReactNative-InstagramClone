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
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'

function Comment(props) {
  const [comments, setComments] = useState([])
  const [postId, setPostId] = useState('')
  const [text, setText] = useState('')
  console.log(props)

  useEffect(() => {
    function matchUserToComment(comments) {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].hasOwnProperty('user')) {
          continue
        }

        const user = props.users.find((x) => x.uid === comments[i].creator)

        if (user == undefined) {
          props.fetchUsersData(comments[i].creator, false)
        } else {
          comments[i].user = user
        }
      }
      setComments(comments)
    }

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
          matchUserToComment(comments)
        })
      setPostId(props.route.params.postId)
    } else {
      matchUserToComment(comments)
    }
  }, [props.route.params.postId, props.users])

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
          <Text style={styles.UId}>{props.route.params.user.name}</Text>
        </TouchableOpacity>
        <Text style={styles.caption}>{props.route.params.caption}</Text>
      </View>
      <View
        style={{
          borderBottomColor: 'silver',
          borderBottomWidth: 1,
        }}
      />
      <FlatList
        numColumns={1}
        horizontal={false}
        inveted={true}
        data={comments}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row' }}>
            {item.user !== undefined ? (
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate('Profile', {
                    uid: props.route.params.user.uid,
                  })
                }
              >
                <Text style={styles.UId}>{item.user.name}</Text>
              </TouchableOpacity>
            ) : null}
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
    margin: '10px',
    fontSize: '16px',
  },
  UId: {
    fontSize: '16px',
    marginTop: '10px',
    marginLeft: '10px',
    fontWeight: 'bold',
  },
  comments: {
    flex: 1,
    marginTop: '10px',
    marginLeft: '10px',
    fontSize: '16px',
  },
  commentBox: {
    fontSize: '17px',
    padding: '10px',
  },
})

const mapStateToProps = (store) => ({
  users: store.usersState.users,
})

const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUsersData }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Comment)
