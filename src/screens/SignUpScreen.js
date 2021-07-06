/* eslint-disable react-native/no-inline-styles */
import React, { Input, useState, Component } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import auth from '@react-native-firebase/auth'
import LinearGradient from 'react-native-linear-gradient'
import { FontAwesome } from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import * as Animatable from 'react-native-animatable'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging'
import { Icon } from 'react-native-vector-icons/FontAwesome5'

const SignUpScreen = ({ navigation }) => {
  const [firstname, setFirstName] = useState(``)
  const [lastname, setLastName] = useState(``)
  const [phone, setPhone] = useState(``)
  const [email, setEmail] = useState(``)
  const [password, setPassword] = useState(``)
  const [confirmpassword, setConfirmPassword] = useState(``)

  const [icon, setIcon] = useState(`eye-off`)
  const [hidePassword, setHidePassword] = useState(true)
  const [hidepass, setHidePass] = useState(true)
  // changeIcon = () => {
  //   icon !== `eye-off`
  //     ? (setIcon(`eye-off`), setHidePassword(false))
  //     : (setIcon(`eye`), setHidePassword(true))
  // }
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     secureTextEntry: true,
  //     iconName: "eye",
  //   }
  // }
  // onIconPress = () => {
  //   let iconName = (this.state.secureTextEntry) ? "eye-off" : "eye";
  //   this.setState({
  //     secureTextEntry: !this.state.secureTextEntry,
  //     iconName: iconName
  //   });
  // }

  const userSignup = async () => {
    if (!email || !password || !confirmpassword) {
      Alert.alert(`please fill all the fields`)
      return
    }
    try {
      const result = await auth().createUserWithEmailAndPassword(
        email,
        password,
        confirmpassword,
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
    <ScrollView>
      <KeyboardAvoidingView style={styles.container1}>
        <View style={styles.box1}>
          <Image
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ width: 200, height: 200 }}
            source={require(`../assets/scms-logo.jpeg`)}
          />
          <Text style={styles.text}>Please Signup!</Text>
        </View>
        <View style={styles.footer}>
          <TextInput
            style={styles.textInput}
            label="First Name"
            value={firstname}
            mode="outlined"
            onChangeText={text => setFirstName(text)}
          />
          <TextInput
            style={styles.textInput}
            label="Last Name"
            value={lastname}
            mode="outlined"
            onChangeText={text => setLastName(text)}
          />
          <View>
            {/* <FontAwesome name="user-o" color="#05375a" size={20} /> */}
            <TextInput
              style={styles.textInput}
              label="Email"
              value={email}
              inlineImageLeft="user-o"
              mode="outlined"
              onChangeText={text => setEmail(text)}
            />
          </View>
          <View>
            {/* <FontAwesome name="lock" color="#05375a" size={20} /> */}
            <TextInput
              // {...this.props}
              style={styles.textInput}
              label="Password"
              secureTextEntry={!!hidepass}
              value={password}
              mode="outlined"
              onChangeText={text => setPassword(text)}
            />
            <Icon
              name={icon}
              size={20}
              onPress={() => setHidePassword(!hidepass)}
            />
            {/* <TouchableOpacity onPress={this.onIconPress}>
              <Icon name={this.state.iconName} size={20} /> */}
            {/* onPress={updateSecureTextEntry} */}
            {/* <Feather name="eye-off" color="grey" size={20} /> */}
            {/* </TouchableOpacity> */}
          </View>
          <TextInput
            style={styles.textInput}
            label="Confirm Password"
            value={confirmpassword}
            mode="outlined"
            secureTextEntry={true}
            onChangeText={text => setConfirmPassword(text)}
          />
          <TextInput
            style={styles.textInput}
            label="Contact Number"
            value={phone}
            mode="outlined"
            keyboardType="numeric"
            onChangeText={text => setPhone(text)}
          />
          <Button
            style={styles.box3}
            mode="contained"
            onPress={() => userSignup()}
          >
            Signup
          </Button>

          {/* <TouchableOpacity onPress={()=>navigation.goBack()}>
                     <Text>login?</Text>
                 </TouchableOpacity> */}

          <TouchableOpacity onPress={() => navigation.goBack()} />
          <View style={styles.footerView}>
            <Text style={styles.footerText}>
              Already have an account?{` `}
              <Text
                onPress={() => navigation.goBack()}
                style={styles.footerLink}
              >
                Log in
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

export default SignUpScreen
const styles = StyleSheet.create({
  container1: {
    flex: 1,
    marginHorizontal: 2,
    justifyContent: `space-evenly`,
  },
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
  box3: {
    marginTop: 7,
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

  container: {
    flex: 1,
    backgroundColor: `#009387`,
  },
  header: {
    flex: 1,
    justifyContent: `flex-end`,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 1,
    // backgroundColor: `#fff`,
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    // paddingHorizontal: 20,
    paddingVertical: 30,
    paddingHorizontal: 40,
    height: `50%`,
    justifyContent: `space-evenly`,
  },
  text_header: {
    color: `#fff`,
    fontWeight: `bold`,
    fontSize: 30,
  },
  text_footer: {
    color: `#05375a`,
    fontSize: 18,
  },
  action: {
    flexDirection: `row`,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: `#f2f2f2`,
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: `row`,
    marginTop: 10,
    borderBottomWidth: 1,
    // borderBottomColor: `#FF0000`,
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: 5,
    paddingLeft: 10,
    color: `#05375a`,
  },
  errorMsg: {
    color: `#FF0000`,
    fontSize: 14,
  },
  button: {
    alignItems: `center`,
    marginTop: 50,
  },
  signIn: {
    width: `100%`,
    height: 50,
    justifyContent: `center`,
    alignItems: `center`,
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: `bold`,
  },
})
