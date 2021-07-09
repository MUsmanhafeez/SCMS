import React, { useEffect, useState } from 'react'
import {
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

const ListPostScreen = ({ navigation, route }) => {
  const { item } = route.params
  // console.log(item)
  const [name] = useState(item.name)
  const [location] = useState(item.location)
  const [desc] = useState(item.desc ? item.desc : ``)
  const [createdAt] = useState(item.createdAt ? item.createdAt : ``)
  const [phone] = useState(item.phone)
  const [members, setMembers] = useState([])
  const [docId, setDocId] = useState(``)
  const postData = async () => {
    if (members.includes(auth().currentUser.uid)) {
      Alert.alert(`You are Already in this organization !`)
    } else {
      members.push(auth().currentUser.uid)
      await firestore()
        .collection(`ads`)
        .doc(docId)
        .update({ members })
    }
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

  console.log(`in comp`)
  return (
    <ScrollView style={{ ScreenWidth: `100%` }}>
      <KeyboardAvoidingView style={styles.container}>
        <Text style={styles.Ad}>{name.trim()} Ad!</Text>

        <TextInput
          style={styles.text}
          label="Field Name"
          editable={false}
          value={name.toString()}
          mode="outlined"
        />
        <TextInput
          style={styles.text}
          label="Contact Number"
          editable={false}
          value={phone.toString()}
          mode="outlined"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.text}
          editable={false}
          label="Location"
          value={location.toString()}
          mode="outlined"
        />
        <TextInput
          style={styles.text}
          label="Description"
          value={desc.toString()}
          editable={false}
          mode="outlined"
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
        <Button
          style={styles.btn1}
          disabled={members.includes(auth().currentUser.uid)}
          mode="contained"
          onPress={() => postData()}
        >
          Enroll
        </Button>
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
    padding: 3,
  },
})

export default ListPostScreen
