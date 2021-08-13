import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button, Image } from 'react-native'
import { Camera } from 'expo-camera'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function App() {
  const [hasPermission, setHasPermission] = useState(null)
  const [camera, setCamera] = useState(null)
  const [image, setImage] = useState(null)

  const [type, setType] = useState(Camera.Constants.Type.back)

  useEffect(() => {
    ;(async () => {
      const { status } = await Camera.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null)
      setImage(data.uri)
    }
  }

  if (hasPermission === null) {
    return <View />
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.camera}
          type={type}
          ratio={'1:1'}
        />
      </View>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: '#09092a',
          padding: '13px',
        }}
      >
        <div>
          <Ionicons
            name='camera-reverse'
            size={26}
            style={{ color: '#ffffff' }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              )
            }}
          />
        </div>
        <div>
          <Ionicons
            name='camera'
            style={{ color: '#ffffff' }}
            size={26}
            onPress={() => takePicture()}
          />
        </div>
      </div>
      {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
  },
})
