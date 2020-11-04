import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Provider as PaperProvider, Text} from 'react-native-paper';
import {Title, DefaultTheme} from 'react-native-paper';
import {Appbar} from 'react-native-paper';
import NavigationContainer from '@react-navigation/native/src/NavigationContainer';
import LoginScreen from './screens/LoginScreen';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyDPHcaVV6I0RnWqFnbv2BrfZi6dgb0LX5I',
  authDomain: 'eatmatic-143319.firebaseapp.com',
  databaseURL: 'https://eatmatic-143319-8b6f2.firebaseio.com',
  projectId: 'eatmatic-143319',
  storageBucket: 'eatmatic-143319.appspot.com',
  messagingSenderId: '1088252386731',
  appId: '1:1088252386731:web:3174573f37cab667a986ee',
  measurementId: 'G-DLKYKBH02H',
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#5e8d93',
    accent: '#eb9f12',
  },
};

const App = () => {

  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="dark-content" />
      <Appbar>
        <Title style={styles.appbarTitle}>SCUVER DRIVER</Title>
      </Appbar>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'Home'}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  appbarTitle: {
    color: '#ffffff',
    textAlign: 'center',
    marginLeft: '32%',
  },
  scrollView: {
    textAlign: 'center',
    padding: '2%',
  },
});

export default App;
