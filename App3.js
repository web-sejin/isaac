import React, {useEffect, useState, useRef} from 'react';
import {Alert, BackHandler, ToastAndroid, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import MyWebView from './src/Webview'
//import Api from './src/Api';
//import { getFormData } from './src/lib/api';
import axios from 'axios';

const App = (props) => {
  const AppTokenSave = async () => {
    const token = await messaging().getToken();
    if(token){
      axios.get(`http://cnj2019.cafe24.com/api/token.php?token=${token}`)
      .then((response) => {
        console.log('성공');
      }).catch((e) => {
        console.log(e);
      });
    }else{
    }
  }

  useEffect(()=> {
    AppTokenSave();
  }, []);

  //앱푸시가 발생할 때 마다 작동
  useEffect(() => {    
    const confirmAlert = () => {
      //작업해야 함
    };

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const msg = JSON.stringify(remoteMessage);
      const title = remoteMessage.notification.title;
      const body = remoteMessage.notification.body;      
      Alert.alert(
        `${title}`,
        `${body}`,
        [
          {
            text: '확인',
            onPress: confirmAlert,
          },
        ],
      );
    });
    // checkToken();

    return unsubscribe;
  });

  return (
    <MyWebView />
  );
};

export default App;