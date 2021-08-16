import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Button,
  Dimensions,
} from 'react-native'
import { connect } from 'react-redux'
import firebase from 'firebase'
require('firebase/firestore')

function Profile(props) {
  const [userPosts, setUserPosts] = useState([])
  const [user, setUser] = useState(null)
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    const { currentUser, posts } = props

    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser)
      setUserPosts(posts)
    } else {
      firebase
        .firestore()
        .collection('users')
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data())
          } else {
            console.log('does not exist')
          }
        })
      firebase
        .firestore()
        .collection('posts')
        .doc(props.route.params.uid)
        .collection('userPosts')
        .orderBy('creation', 'desc')
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data()
            const id = doc.id
            return { id, ...data }
          })
          setUserPosts(posts)
        })
    }

    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true)
    } else {
      setFollowing(false)
    }
  }, [props.route.params.uid, props.following])

  const onFollow = () => {
    firebase
      .firestore()
      .collection('following')
      .doc(firebase.auth().currentUser.uid)
      .collection('userFollowing')
      .doc(props.route.params.uid)
      .set({})
  }

  const onUnfollow = () => {
    firebase
      .firestore()
      .collection('following')
      .doc(firebase.auth().currentUser.uid)
      .collection('userFollowing')
      .doc(props.route.params.uid)
      .delete()
  }

  const onLogout = () => {
    firebase.auth().signOut()
  }

  if (user === null) {
    return <View />
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        {user.profilePic !== null ? (
          <View style={{ flexDirection: 'row' }}>
            <Image source={user.profilePic} style={styles.profilePic} />
            <Text style={styles.userName}>{user.name}</Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={require('../../assets/blankProfile.png')}
              style={styles.profilePic}
            />
            <Text style={styles.userName}>{user.name}</Text>
          </View>
        )}

        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
          <View>
            {following ? (
              <Button title='Folllowing' onPress={() => onUnfollow()} />
            ) : (
              <Button title='Follow' onPress={() => onFollow()} />
            )}
          </View>
        ) : (
          <Button title='Logout' onPress={() => onLogout()} />
        )}
      </View>
      <View style={styles.containerGallery}>
        {userPosts.length > 0 ? (
          <FlatList
            numColumns={3}
            horizontal={false}
            data={userPosts}
            renderItem={({ item }) => (
              <View style={styles.containerImage}>
                <Image
                  style={styles.image}
                  source={{ uri: item.downloadURL }}
                />
              </View>
            )}
          />
        ) : (
          <Text style={{ textAlign: 'center', marginTop: '50px' }}>
            Post a picture now!
          </Text>
        )}
      </View>
    </View>
  )
}

const win = Dimensions.get('window')
const picture = win.width * (1 / 3)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInfo: {
    margin: 10,
  },
  containerGallery: {
    flex: 1,
  },
  image: {
    aspectRatio: 1 / 1,
    width: picture - 1,
    height: picture - 1,
    marginBottom: 1,
  },
  containerImage: {
    flex: 1 / 3,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginLeft: '10px',
    marginBottom: '15px',
  },
  userName: {
    fontSize: '26px',
    marginBottom: '6px',
    marginLeft: '20px',
    marginTop: '30px',
  },
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
})

export default connect(mapStateToProps, null)(Profile)
