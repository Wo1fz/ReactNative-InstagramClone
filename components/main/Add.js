import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native'
import { Camera } from 'expo-camera'
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as ImagePicker from 'expo-image-picker'

export default function App({ navigation }) {
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
        {!image ? (
          <Camera
            ref={(ref) => setCamera(ref)}
            style={styles.camera}
            type={type}
            ratio={'1:1'}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.backButton}>
                <Ionicons
                  name='arrow-back'
                  style={{ color: '#09092a' }}
                  size={28}
                  onPress={(event) => {
                    event.preventDefault()
                    navigation.navigate('Feed')
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.pictureButton}>
                <Ionicons
                  name='camera-reverse'
                  size={28}
                  style={{ color: '#09092a' }}
                  onPress={() => {
                    setType(
                      type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                    )
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.pictureButton}>
                <Ionicons
                  name='camera'
                  style={{ color: '#09092a' }}
                  size={40}
                  onPress={() => takePicture()}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.pictureButton}>
                <Ionicons
                  name='images-outline'
                  style={{ color: '#09092a' }}
                  size={28}
                  onPress={() => pickImage()}
                />
              </TouchableOpacity>
            </View>
          </Camera>
        ) : (
          <View style={styles.container}>
            <Image
              source={{ uri: image }}
              style={{ flex: 1, aspectRatio: 1 }}
            />
            <Button
              title='Save'
              onPress={() => navigation.navigate('Save', { image })}
            />
            <Button title='Back' onPress={() => setImage(null)} />
          </View>
        )}
      </View>
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
  buttonContainer: {
    flex: '1',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: '20',
    justifyContent: 'space-between',
  },
  backButton: {
    flex: '0.1',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginTop: '10px',
    marginLeft: '10px',
  },
  pictureButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
    padding: '10px',
  },
})
