import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Button,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import firebase from 'firebase'
require('firebase/firestore')

function Feed(props) {
  const [posts, setPosts] = useState([])
  console.log(posts)

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
        return y.creation - x.creation
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
                {item.user.profilePic === null ? (
                  <View style={{ flexDirection: 'row' }}>
                    <Image
                      source={require('../../assets/blankProfile.png')}
                      style={styles.profilePic}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('Profile', {
                          uid: item.user.uid,
                        })
                      }
                    >
                      <Text style={styles.name}>{item.user.name}</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row' }}>
                    <Image
                      source={item.user.profilePic}
                      style={styles.profilePic}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('Profile', {
                          uid: item.user.uid,
                        })
                      }
                    >
                      <Text style={styles.name}>{item.user.name}</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <Image
                  style={styles.image}
                  source={{ uri: item.downloadURL }}
                />
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate('Profile', {
                        uid: item.user.uid,
                      })
                    }
                  >
                    <Text
                      style={{
                        fontSize: '17px',
                        marginLeft: '10px',
                        fontWeight: 'bold',
                      }}
                    >
                      {item.user.name}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.caption}>{item.caption}</Text>
                </View>
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
    fontSize: '18px',
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
    marginLeft: '15px',
  },
  caption: {
    flex: 1,
    marginLeft: '7px',
    marginBottom: '35px',
    fontSize: '17px',
  },
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
})

export default connect(mapStateToProps, null)(Feed)
