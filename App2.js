import React, {useEffect, useState} from 'react';
import {Alert, BackHandler, ToastAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
//import MyWebView from './src/Webview'
import {WebView} from 'react-native-webview';

export default function App() {
  let MyWebView;
  const [fcmToken, setFcmToken] = useState('');
  const checkToken = async () => {
    const token = await messaging().getToken();
    if (token) {
      setFcmToken(token);
    }
  };

  //토큰값이 변경될 때마다 로그인한 아이디의 칼럼[mb_marketer_token]에 업데이트
  useEffect(() => {    
    if (fcmToken !== '') {
      //console.log(fcmToken);
      try {
        MyWebView.postMessage(
          JSON.stringify({action: 'setToken', token: fcmToken}),
        );
      } catch (e) {
        console.log(e);
      }
    }
  }, [fcmToken]);

  //앱푸시가 발생할 때 마다 작동
  useEffect(() => {    
    const confirmAlert = () => {
      try {
        MyWebView.postMessage(JSON.stringify({action: 'confirmAlert'}));
      } catch (e) {
        console.log(e);
      }
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

  //
  //useEffect(() => {}, []);
  // }) 랜더링 될 때마다 실행
  // }, []) 컴포넌트 최초 랜더링 시에만 실행
  // }, [state변수]) state변수가 변경될 때만 실행 (최초 + 변경될 때)
  //

  return (
    <WebView
      ref={el => (MyWebView = el)}
      startInLoadingState={true}
      onLoadEnd={checkToken}
      source={{uri: 'http://cnj2019.cafe24.com/'}}
      //onNavigationStateChange={(navState) => { webViewSt.canGoBack = navState.canGoBack; }}
    />
  );
}
