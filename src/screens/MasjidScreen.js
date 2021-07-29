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
import auth from '@react-native-firebase/auth'
import * as _ from 'lodash'

const MasjidScreen = ({ navigation, route }) => {
  const { item } = route.params
  const [name, setName] = useState(item.name)
  const [iName, setIName] = useState(item.iName ? item.iName : ``)
  const [location] = useState(item.location)
  const [desc, setDescription] = useState(item.desc ? item.desc : ``)
  const [createdAt] = useState(item.createdAt ? item.createdAt : ``)
  const [phone, setPhone] = useState(item.phone)
  const [totalAmount, setTotalAmount] = useState(
    item.totalAmount ? item.totalAmount : 0,
  )
  const [addedAmount, setAddedAmount] = useState(0)
  const [members, setMembers] = useState([])
  const [docId, setDocId] = useState(``)
  const [isOwner] = useState(item.owner === auth().currentUser.uid)

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
  const postData = async () => {
    try {
      const b = totalAmount + addedAmount

      await firestore()
        .collection(`ads`)
        .doc(docId)
        .update({
          totalAmount: b,
        })
      setTotalAmount(b)
      setAddedAmount(0)
      const dummyArray = _.cloneDeep(members) || []
      dummyArray?.push(auth().currentUser.uid)
      setMembers(dummyArray)
      await firestore()
        .collection(`ads`)
        .doc(docId)
        .update({ members: dummyArray })

      Alert.alert(`Amount Added Sucessfully!`)
    } catch (err) {
      Alert.alert(`something went wrong.try again`)
    }
  }
  const updateData = async () => {
    try {
      await firestore()
        .collection(`ads`)
        .doc(docId)
        .update({ name, iName, desc, phone })
      Alert.alert(`Updated Sucessfully!`)
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
      Alert.alert(`Post Deleted!`)
    } catch (error) {}
  }
  return (
    <ScrollView style={{ ScreenWidth: `100%` }}>
      <KeyboardAvoidingView style={styles.container}>
        <Text style={styles.Ad}>{name.trim()} Ad!</Text>

        <TextInput
          style={styles.text}
          label="Masjid Name"
          editable={isOwner}
          value={name.toString()}
          mode="outlined"
        />
        <TextInput
          style={styles.text}
          label="Masjid Imam Name"
          editable={isOwner}
          value={iName.toString()}
          mode="outlined"
        />
        <TextInput
          style={styles.text}
          label="Contact Number"
          editable={isOwner}
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
          editable={isOwner}
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
        <TextInput
          style={styles.text}
          label="TotalAmount Currently"
          editable={false}
          value={totalAmount.toString()}
          mode="outlined"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.text}
          label="Add Amount"
          value={addedAmount.toString()}
          mode="outlined"
          keyboardType="numeric"
          onChangeText={text => setAddedAmount(Number(text))}
        />

        <Button
          style={styles.btn1}
          disabled={addedAmount === 0}
          mode="contained"
          onPress={() => postData()}
        >
          Add Amount
        </Button>

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

export default MasjidScreen
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
