import React from 'react'
import { StyleSheet, View, Text, Image, FlatList } from 'react-native'
import { connect } from 'react-redux'

function Profile(props) {
  const { currentUser, posts } = props

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text style={{ fontSize: '24px' }}>{currentUser.name}</Text>
      </View>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
            </View>
          )}
        />
      </View>
    </View>
  )
}

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
    flex: 1,
    aspectRatio: 1 / 1,
    width: '119px',
    height: '119px',
    marginBottom: '1px',
  },
  containerImage: {
    flex: 1 / 3,
  },
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
})

export default connect(mapStateToProps, null)(Profile)
