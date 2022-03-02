/**
 * @format
 */

import {AppRegistry, Text, TextInput, Platform, Alert} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

// Register background handler // app closed & background 일때
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  /*if (Platform.OS === 'ios') {
    PushNotificationIOS.getApplicationIconBadgeNumber(function(number) {
      PushNotificationIOS.setApplicationIconBadgeNumber(number+1);
    });
  }*/
});

// Register foreground handler
messaging().onMessage(async remoteMessage => {
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
});

async function registerAppWithFCM() {
  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging().registerDeviceForRemoteMessages();
  }
}
async function requestUserPermission() {
  const settings = await messaging().requestPermission();

  if (settings) {
      console.log('Permission settings:', settings);
      const fcmToken = await firebase.messaging().getToken();
      console.log(fcmToken);
  }
}
registerAppWithFCM();
requestUserPermission();


AppRegistry.registerComponent(appName, () => App);