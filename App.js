import React, {useEffect, useState, useRef} from 'react';
import {Alert, BackHandler, ToastAndroid, Platform, SafeAreaView} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import MyWebView from './src/Webview'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';

const App = (props) => {
  const [deviceToken, setDeviceToken] = useState('');
  const AppTokenSave = async () => {    
    const token = await messaging().getToken();
    if(token){
      axios.get(`http://cnj2019.cafe24.com/api/token.php?token=${token}`)
      .then((response) => {
        console.log("토큰 전송 성공");
        setDeviceToken(token);
        // AsyncStorage.setItem('token',token, () => {
        //   console.log('디바이스 토큰 저장 완료')
        // });

      }).catch((e) => {
        console.log(e);
      });
    }
  }

  // AsyncStorage.getItem('token', (err, result) => { //user_id에 담긴 아이디 불러오기
  //   console.log(result); // result에 담김 //불러온거 출력
  // });

  useEffect(()=> {
    //console.log("init...1");
    AppTokenSave();    
  }, []);


  return (
    <SafeAreaView style={{flex:1}}>
        <MyWebView deviceToken={deviceToken} />
    </SafeAreaView>
  );
};

export default App;