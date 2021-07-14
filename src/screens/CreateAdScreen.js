import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import firestore from '@react-native-firebase/firestore'
import { launchCamera } from 'react-native-image-picker'
import storage from '@react-native-firebase/storage'
import uuid from 'react-native-uuid'
import { CheckBoxGroup } from '../component/checkBoxGroup'
import auth from '@react-native-firebase/auth'

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
  const [image, setImage] = useState(``)
  const [totalAmount, setTotalAmount] = useState(0)
  const [isMasjid, setIsMasjid] = useState(
    checkboxes.filter(cb => cb.title === `Masjid`)[0].checked,
  )
  const check = checkboxes[0].checked
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
          image,
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
    launchCamera({ quality: 0.5 }, fileobj => {
      const uploadTask = storage()
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
            setImage(downloadURL)
          })
        },
      )
    })
  }
  return (
    <ScrollView>
      <KeyboardAvoidingView style={styles.container}>
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
          style={styles.text}
          label="Description"
          value={desc.toString()}
          mode="outlined"
          numberOfLines={3}
          multiline={true}
          onChangeText={text => setDesc(text)}
        />

        {isMasjid && (
          <TextInput
            style={styles.text}
            label="Add Amount"
            value={totalAmount.toString()}
            mode="outlined"
            keyboardType="numeric"
            onChangeText={text => setTotalAmount(Number(text))}
          />
        )}

        {!isMasjid && (
          <Button
            style={styles.btn1}
            icon="camera"
            mode="contained"
            onPress={() => openCamera()}
          >
            upload Image
          </Button>
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
    marginBottom: 10,
    padding: 3,
  },
})
