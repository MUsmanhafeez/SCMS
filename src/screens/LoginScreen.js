import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
} from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import auth from '@react-native-firebase/auth'
// import { MaterialCommunityIcons } from '@expo/vector-icons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import tw from 'tailwind-react-native-classnames'

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState(``)
  const [password, setPassword] = useState(``)

  const userLogin = async () => {
    if (!email || !password) {
      Alert.alert(`please fill all the fields`)
      return
    }
    try {
      const result = await auth().signInWithEmailAndPassword(email, password)
    } catch (err) {
      Alert.alert(`Error! wrong credentials...`)
    }
  }
  const [isPasswordView, setIsPasswordView] = useState(false)
  return (
    <KeyboardAvoidingView behavior="position">
      <View style={styles.box1}>
        <Image
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ width: 200, height: 200 }}
          source={require(`../assets/scms-logo.jpeg`)}
        />
        <Text style={styles.text}>please login to continue!</Text>
      </View>
      <View style={styles.box2}>
        <TextInput
          label="Email"
          value={email}
          mode="outlined"
          onChangeText={text => setEmail(text)}
        />
        <View style={tw`relative mb-5 mt-4`}>
          <TextInput
            label="Password"
            value={password}
            mode="outlined"
            secureTextEntry={isPasswordView}
            onChangeText={text => setPassword(text)}
          />

          <TouchableOpacity
            style={tw`absolute z-20 top-5 right-2 h-16 w-10`}
            onPress={() => {
              setIsPasswordView(!isPasswordView)
            }}
          >
            <MaterialCommunityIcons
              name={`${!isPasswordView ? `eye-outline` : `eye-off-outline`}`}
              size={30}
              color={`#057094`}
            />
          </TouchableOpacity>
        </View>
        <Button mode="contained" onPress={() => userLogin()}>
          Login
        </Button>
        {/* <TouchableOpacity onPress={()=>navigation.navigate("signup")}>
                     <Text style={{textAlign:"center"}}>Don't have a account {''} SignUp </Text>
                 </TouchableOpacity> */}

        {/* <TouchableOpacity

                    onPress={()=>navigation.navigate("signup")}>

                </TouchableOpacity> */}
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Don't have an account?{` `}
            <Text
              onPress={() => navigation.navigate(`signup`)}
              style={styles.footerLink}
            >
              Sign up
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
  Icon: {
    top: 0,
    position: `absolute`,
  },
})

export default LoginScreen
