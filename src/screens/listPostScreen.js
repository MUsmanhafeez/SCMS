import React, { useEffect, useState } from 'react'
import {
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import firestore from '@react-native-firebase/firestore'
import auth, { firebase } from '@react-native-firebase/auth'
import * as _ from 'lodash'
const ListPostScreen = ({ route }) => {
  const { item } = route.params
  const [name, setName] = useState(item.name)
  const [location, setLocation] = useState(item.location)
  const [desc, setDescription] = useState(item.desc ? item.desc : ``)
  const [createdAt] = useState(item.createdAt ? item.createdAt : ``)
  const [phone, setPhone] = useState(item.phone)
  const [members, setMembers] = useState([])
  const [docId, setDocId] = useState(``)
  const [isOwner, setIsOwner] = useState(item.owner === auth().currentUser.uid)

  const postData = async () => {
    try {
      if (members?.includes(auth().currentUser.uid)) {
        Alert.alert(`You are Already in this organization !`)
      } else {
        const dummyArray = _.cloneDeep(members) || []
        dummyArray?.push(auth().currentUser.uid)
        setMembers(dummyArray)
        await firestore()
          .collection(`ads`)
          .doc(docId)
          .update({ members: dummyArray })
        Alert.alert(`You are sucessfully enrolled in this organization!`)
      }
    } catch (err) {
      Alert.alert(`something went wrong.try again`)
    }
  }
  const updateData = async () => {
    try {
      await firestore()
        .collection(`ads`)
        .doc(docId)
        .update({ name, location, desc, phone })
      Alert.alert(`Organization is Updated!`)
    } catch (err) {}
  }
  const deleteData = async () => {
    try {
      await firestore()
        .collection(`ads`)
        .where(`id`, `==`, item.id)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.ref.delete()
          })
        })
      Alert.alert(`Organization is Deleted!`)
    } catch (error) {}
  }

  useEffect(() => {
    async function getQuerySnap() {
      const querySnap = await firestore()
        .collection(`ads`)
        .where(`id`, `==`, item.id)
        .get()
      setDocId(querySnap.docs[0].id)
      setMembers(querySnap.docs[0].get(`members`))
    }
    getQuerySnap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ScrollView style={{ ScreenWidth: `100%` }}>
      <KeyboardAvoidingView style={styles.container}>
        <Text style={styles.Ad}>{name.trim()} Ad!</Text>
        <TextInput
          style={styles.text}
          label="Field Name"
          editable={isOwner}
          value={name.toString()}
          onChangeText={text => setName(text)}
          mode="outlined"
        />
        <TextInput
          style={styles.text}
          label="Contact Number"
          editable={isOwner}
          value={phone.toString()}
          onChangeText={text => setPhone(text)}
          mode="outlined"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.text}
          editable={isOwner}
          label="Location"
          value={location.toString()}
          onChangeText={text => setLocation(text)}
          mode="outlined"
        />
        <TextInput
          style={styles.text}
          label="Description"
          value={desc.toString()}
          editable={isOwner}
          mode="outlined"
          onChangeText={text => setDescription(text)}
          numberOfLines={3}
          multiline={true}
        />
        <TextInput
          style={styles.text}
          label="Created At"
          value={
            new Date(createdAt._seconds * 1000).toDateString() +
            ` at ` +
            new Date(createdAt._seconds * 1000).toLocaleTimeString()
          }
          editable={false}
          mode="outlined"
          keyboardType="numeric"
        />
        {!isOwner && (
          <Button
            style={styles.btn1}
            disabled={members?.includes(auth().currentUser.uid)}
            mode="contained"
            onPress={() => postData()}
          >
            Enroll
          </Button>
        )}

        {isOwner && (
          <View>
            <Button
              style={styles.btn1}
              // disabled={members?.includes(auth().currentUser.uid)}
              mode="contained"
              onPress={() => updateData()}
            >
              Update
            </Button>
            <Button
              style={styles.btn2}
              // disabled={members?.includes(auth().currentUser.uid)}
              mode="contained"
              onPress={() => deleteData()}
            >
              Delete
            </Button>
          </View>
        )}
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

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
  text: {
    padding: 3,
  },
  btn1: {
    marginBottom: 10,
    marginTop: 10,
    padding: 3,
  },
  btn2: {
    marginBottom: 10,
    padding: 3,
  },
})

export default ListPostScreen
