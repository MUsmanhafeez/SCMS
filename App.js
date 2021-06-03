/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {StatusBar, StyleSheet, Text, useColorScheme, View} from 'react-native';
import 'react-native-gesture-handler';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {
  NavigationContainer,
  DefaultTheme as DefaultThemeNav,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import HomeScreen from './src/screens/ListAllItemScreen';
import CreateAdScreen from './src/screens/CreateAdScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import AccountScreen from './src/screens/AccountScreen';
import MasjidScreen from './src/screens/MasjidScreen';
import listPostScreen from './src/screens/listPostScreen';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#057094',
  },
};
const MyTheme = {
  ...DefaultThemeNav,
  colors: {
    ...DefaultThemeNav.colors,
    backgroundColor: '#fff',
  },
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const homeStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="masjidScreen"
        component={MasjidScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="listpostscreen"
        component={listPostScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="signup"
        component={SignUpScreen}
        options={{headerShown: false}}
      />

      {/* <Stack.Screen
        name="listScreen"
        component={SignUpScreen}
        options={{headerShown: false}}
      /> */}
    </Stack.Navigator>
  );
};
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color}) => {
          let iconName;

          if (route.name === 'HomeScreen') {
            iconName = 'home';
          } else if (route.name === 'create') {
            iconName = 'plus-circle';
          } else if (route.name === 'account') {
            iconName = 'user';
          }

          // You can return any component that you like here!
          return (
            <View
              style={{
                borderWidth: 0,
                borderColor: 'white',
                borderRadius: 0,
              }}>
              <Feather name={iconName} size={35} color={color} />
            </View>
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: 'deepskyblue',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={homeStackScreen}
        options={{title: ''}}
      />
      <Tab.Screen
        name="create"
        component={CreateAdScreen}
        options={{title: ''}}
      />
      <Tab.Screen
        name="account"
        component={AccountScreen}
        options={{title: ''}}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  const [user, setUser] = useState('');
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(userExist => {
      if (userExist) {
        setUser(userExist);
      } else {
        setUser('');
      }
    });
    return unsubscribe;
  }, []);
  return (
    <NavigationContainer theme={theme}>
      {user ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="dark-content" backgroundColor="#057094" />

        <View style={styles.container}>
          <Navigation />
        </View>
      </PaperProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
