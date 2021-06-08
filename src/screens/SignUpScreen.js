import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import auth from '@react-native-firebase/auth'

import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging'

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState(``)
  const [password, setPassword] = useState(``)

  const userSignup = async () => {
    if (!email || !password) {
      Alert.alert(`please fill all the fields`)
      return
    }
    try {
      const result = await auth().createUserWithEmailAndPassword(
        email,
        password,
      )
      messaging()
        .getToken()
        .then(token => {
          firestore()
            .collection(`usertoken`)
            .add({
              token: token,
            })
        })
    } catch (err) {
      Alert.alert(`Error! wrong credentials...`)
    }
  }

  return (
    <KeyboardAvoidingView behavior="position">
      <View style={styles.box1}>
        <Image
          style={{ width: 200, height: 200 }}
          source={require(`../assets/scms-logo.jpeg`)}
        />
        <Text style={styles.text}>Please Signup!</Text>
      </View>
      <View style={styles.box2}>
        <TextInput
          label="Email"
          value={email}
          mode="outlined"
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          label="password"
          value={password}
          mode="outlined"
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
        />
        <Button mode="contained" onPress={() => userSignup()}>
          Signup
        </Button>

        {/* <TouchableOpacity onPress={()=>navigation.goBack()}>
                     <Text>login?</Text>
                 </TouchableOpacity> */}

        <TouchableOpacity onPress={() => navigation.goBack()} />
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Already have an account?{` `}
            <Text onPress={() => navigation.goBack()} style={styles.footerLink}>
              Log in
            </Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  box1: {
    alignItems: `center`,
  },
  box2: {
    paddingHorizontal: 40,
    height: `50%`,
    justifyContent: `space-evenly`,
  },
  text: {
    fontSize: 22,
  },

  footerView: {
    flex: 1,
    alignItems: `center`,
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: `#2e2e2d`,
  },
  footerLink: {
    color: `#788eec`,
    fontWeight: `bold`,
    fontSize: 16,
  },
})

export default SignUpScreen
