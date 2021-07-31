import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import firestore from '@react-native-firebase/firestore'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import storage from '@react-native-firebase/storage'
import uuid from 'react-native-uuid'
import { CheckBoxGroup } from '../component/checkBoxGroup'
import auth from '@react-native-firebase/auth'
import ImagePicker from 'react-native-image-crop-picker'
import * as _ from 'lodash'
import { SliderBox } from 'react-native-image-slider-box'
import tw from 'tailwind-react-native-classnames'
import Spinner from 'react-native-loading-spinner-overlay'

const CreateAdScreen = () => {
  const [checkboxes, setCheckboxes] = useState([
    {
      id: 1,
      title: `Masjid`,
      checked: false,
    },
    {
      id: 2,
      title: `Others`,
      checked: true,
    },
  ])
  const [name, setName] = useState(``)
  const [iName, setIName] = useState(``)
  const [location, setLocation] = useState(``)
  const [desc, setDesc] = useState(``)
  const [createdAt] = useState(``)
  const [phone, setPhone] = useState(``)
  const [totalAmount, setTotalAmount] = useState(0)
  const [isMasjid, setIsMasjid] = useState(
    checkboxes.filter(cb => cb.title === `Masjid`)[0].checked,
  )
  const [images, setImages] = useState([])
  const check = checkboxes[0].checked
  const [isUploading, setUploading] = useState(false)
  useEffect(() => {
    const checkMajisd = checkboxes.filter(cb => cb.title === `Masjid`)[0]
      .checked
    setIsMasjid(checkMajisd)
  }, [check, checkboxes])
  //   const sendNoti = () => {
  //     firestore()
  //       .collection('usertoken')
  //       .get()
  //       .then(querySnap => {
  //         const userDevicetoken = querySnap.docs.map(docSnap => {
  //           return docSnap.data().token;
  //         });
  //         fetch('/send-noti', {
  //           method: 'post',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({
  //             tokens: userDevicetoken,
  //           }),
  //         });
  //       });
  //   };

  const postData = async () => {
    const id = uuid.v4()
    const postType = checkboxes.filter(cb => cb.checked)[0].title

    try {
      //   throw error('asd');
      await firestore()
        .collection(`ads`)
        .add({
          id,
          name,
          iName,
          location,
          desc,
          postType,
          phone,
          images: !isMasjid && images,
          totalAmount,
          createdAt: new Date(),
          owner: auth().currentUser.uid,
          members: [],
        })
      Alert.alert(`posted your Ad!`)
    } catch (err) {
      Alert.alert(`something went wrong.try again`)
    }
  }

  const openCamera = () => {
    launchCamera({ quality: 0.5, selectionLimit: 0 }, async fileobj => {
      setUploading(true)
      const uploadTask = await storage()
        .ref()
        .child(`/items/${Date.now()}`)
        .putFile(fileobj.uri)

      uploadTask.on(
        `state_changed`,
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          if (progress === 100) {
            Alert.alert(`uploaded`)
          }
        },
        () => {
          Alert.alert(`something went wrong`)
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            // setImages(images.concat(downloadURL))
            const imgs = _.cloneDeep(images)
            imgs.push(downloadURL)
            setImages(imgs)
          })
        },
      )
      setUploading(false)
    })
  }
  const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }
  const openGallery = async () => {
    await ImagePicker.openPicker({ multiple: true, mediaType: `image` }).then(
      async filesobj => {
        const img = []
        setUploading(true)
        await asyncForEach(filesobj, async fileobj => {
          const uploadId = uuid.v4()
          await storage()
            .ref()
            .child(`/items/${uploadId}`)
            .putFile(fileobj.path)
          await storage()
            .ref()
            .child(`/items/${uploadId}`)
            .getDownloadURL()
            .then(downloadURL => {
              img.push(downloadURL)
            })
        })
        setImages([...images, ...img])
        setUploading(false)
        Alert.alert(`files uploaded`)
      },
    )
  }
  return (
    <ScrollView>
      <KeyboardAvoidingView style={styles.container}>
        {isUploading && <Spinner textContent="Please Wait" visible={true} />}
        <Text style={styles.Ad}>Create Ad!</Text>
        <View style={styles.checkboxContainer}>
          <CheckBoxGroup
            checkboxes={checkboxes}
            setCheckboxes={setCheckboxes}
          />
        </View>

        <TextInput
          style={styles.text}
          label={!isMasjid ? `Field Name` : `Masjid Name`}
          value={name.toString()}
          mode="outlined"
          onChangeText={text => setName(text)}
        />
        {isMasjid && (
          <TextInput
            style={styles.text}
            label="Masjid Imam Name"
            value={iName.toString()}
            mode="outlined"
            onChangeText={text => setIName(text)}
          />
        )}
        <TextInput
          style={styles.text}
          label="Contact Number"
          value={phone.toString()}
          mode="outlined"
          keyboardType="numeric"
          onChangeText={text => setPhone(text)}
        />
        <TextInput
          style={styles.text}
          label="Location"
          value={location.toString()}
          mode="outlined"
          onChangeText={text => setLocation(text)}
        />
        <TextInput
          style={tw`p-1 mb-1`}
          label="Description"
          value={desc.toString()}
          mode="outlined"
          numberOfLines={3}
          multiline={true}
          onChangeText={text => setDesc(text)}
        />

        {isMasjid && (
          <TextInput
            style={tw`p-1 mb-1`}
            label="Add Amount"
            value={totalAmount.toString()}
            mode="outlined"
            keyboardType="numeric"
            onChangeText={text => setTotalAmount(Number(text))}
          />
        )}
        {!isMasjid && (
          <SliderBox sliderBoxHeight={200} parentWidth={332} images={images} />
        )}
        {!isMasjid && (
          <Button
            style={styles.btn1}
            icon="camera"
            mode="contained"
            onPress={() => openCamera()}
          >
            Open Camera
          </Button>
        )}
        {!isMasjid && (
          <View>
            <Button
              style={styles.btn1}
              icon="image"
              mode="contained"
              // onPress={() => openGallery()}
              onPress={openGallery}
              disabled={isUploading}
            >
              Choose Image from Gallery
            </Button>
          </View>
        )}

        <Button
          style={styles.btn1}
          disabled={!!(name === `` || location === `` || phone === ``)}
          mode="contained"
          onPress={() => postData()}
        >
          Post
        </Button>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}
export default CreateAdScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
    justifyContent: `space-evenly`,
  },
  Ad: {
    fontSize: 22,
    textAlign: `center`,
  },
  checkboxContainer: {
    flexDirection: `row`,
    marginVertical: 30,
    fontSize: 10,

    alignItems: `center`,
  },
  containerStyle: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: `center`,
  },
  text: {
    padding: 3,
  },
  btn1: {
    marginTop: 10,
    padding: 3,
  },
})
