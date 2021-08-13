import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { Camera } from 'expo-camera'
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as ImagePicker from 'expo-image-picker'

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null)
  const [hasGaleryPermission, setHasGaleryPermission] = useState(null)
  const [camera, setCamera] = useState(null)
  const [image, setImage] = useState(null)

  const [type, setType] = useState(Camera.Constants.Type.back)

  useEffect(() => {
    ;(async () => {
      const cameraStatus = await Camera.requestPermissionsAsync()
      setHasCameraPermission(cameraStatus.status === 'granted')

      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync()
      setHasGaleryPermission(galleryStatus.status === 'granted')
    })()
  }, [])

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null)
      setImage(data.uri)
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.cancelled) {
      setImage(result.uri)
    }
  }

  if (hasCameraPermission === null || hasGaleryPermission === false) {
    return <View />
  }
  if (hasCameraPermission === false || hasGaleryPermission === false) {
    return <Text>No access to camera/galery</Text>
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
          backgroundColor: 'transparent',
          padding: '13px',
        }}
      >
        <div>
          <Ionicons
            name='camera-reverse'
            size={26}
            style={{ color: '#09092a' }}
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
            style={{ color: '#09092a' }}
            size={26}
            onPress={() => takePicture()}
          />
        </div>
        <div>
          <Ionicons
            name='images-outline'
            style={{ color: '#09092a' }}
            size={26}
            onPress={() => pickImage()}
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
