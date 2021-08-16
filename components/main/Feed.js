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

function Feed(props) {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    let posts = []

    if (props.usersLoaded === props.following.length) {
      for (let i = 0; i < props.following.length; i++) {
        const user = props.users.find((el) => el.uid === props.following[i])

        if (user != undefined) {
          posts = [...posts, ...user.posts]
        }
      }

      posts.sort(function (x, y) {
        return x.creation - y.creation
      })

      setPosts(posts)
    }
  }, [props.usersLoaded])

  return (
    <View style={styles.container}>
      <View style={styles.containerGallery}>
        {posts.length > 0 ? (
          <FlatList
            numColumns={1}
            horizontal={false}
            data={posts}
            renderItem={({ item }) => (
              <View style={styles.container}>
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={item.user.profilePic}
                    style={styles.profilePic}
                  />
                  <Text style={styles.name}>{item.user.name}</Text>
                </View>
                <Image
                  style={styles.image}
                  source={{ uri: item.downloadURL }}
                />
              </View>
            )}
          />
        ) : (
          <Text style={{ fontSize: '20px', marginTop: '40px' }}>
            Follow someone now!
          </Text>
        )}
      </View>
    </View>
  )
}

const win = Dimensions.get('window')
const picture = win.width

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerGallery: {
    flex: 1,
    alignItems: 'center',
  },
  name: {
    flex: 1,
    color: 'black',
    fontSize: '20px',
    margin: '8px',
  },
  image: {
    aspectRatio: 1 / 1,
    width: picture,
    height: picture - 110,
    marginBottom: 1,
  },
  profilePic: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginLeft: '7px',
    marginTop: '6px',
    marginBottom: '5px',
  },
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
})

export default connect(mapStateToProps, null)(Feed)
