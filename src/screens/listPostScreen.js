import React, {useState} from 'react';
import {Text, StyleSheet, KeyboardAvoidingView} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {ScrollView} from 'react-native';

const listPostScreen = ({navigation, route}) => {
  const {item} = route.params;
  const [name] = useState(item.name);
  const [location] = useState(item.location);
  const [desc] = useState(item.desc ? item.desc : '');
  const [createdAt] = useState(item.createdAt ? item.createdAt : '');
  const [phone] = useState(item.phone);
  const postData = async () => {
    const querySnap = await firestore()
      .collection('ads')
      .where('id', '==', item.id)
      .get();

    // const docid = querySnap.docs[0].id;
    // await firestore()
    //   .collection('ads')
    //   .doc(docid)
    //   .update({totalAmount: totalAmount + addedAmount});
    // this.forceUpdate();
  };
  console.log(createdAt);
  return (
    <ScrollView style={{ScreenWidth: '100%'}}>
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
            ' at ' +
            new Date(createdAt._seconds * 1000).toLocaleTimeString()
          }
          editable={false}
          mode="outlined"
          keyboardType="numeric"
        />
        <Button
          style={styles.btn1}
          //   disabled={addedAmount == 0 ? true : false}
          mode="contained"
          onPress={() => postData()}>
          Post
        </Button>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default listPostScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 30,
    justifyContent: 'space-evenly',
  },
  Ad: {
    fontSize: 22,
    textAlign: 'center',
  },
  text: {
    padding: 3,
  },
  btn1: {
    marginBottom: 10,
    padding: 3,
  },
});
