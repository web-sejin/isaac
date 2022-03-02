import React, { Component } from 'react';
import { BackHandler,Alert,ToastAndroid } from 'react-native';
import { WebView } from 'react-native-webview';
import messaging from '@react-native-firebase/messaging';
import SplashScreen from 'react-native-splash-screen';

// ...
const webUrl = "http://cnj2019.cafe24.com/";
class MyWebComponent extends Component {
  webView = {
    canGoBack: false,
    ref: null,
    postMessage: false,
    currentUrl: ""
  }

  stateAA = {
    isQuit: false,
  }
  
  onAndroidBackPress = () => {    
    //return true : 기존 뒤로가기 명령 무시
    //return false : 기존 뒤로가기 명령 실행
    console.log('press back btn');
    if(this.webView.currentUrl === webUrl){
      this.webView.canGoBack = false;
    }

    //웹뷰안에서 (홈이 아닐때 뒤로가기 클릭 이벤트)
    if (this.webView.canGoBack && this.webView.ref) {      
      this.stateAA.isQuit = false;
      this.webView.ref.goBack();
      return true;
    }


    
    //홈일 때 뒤로가기 버튼 클릭 이벤트
    // 2000(2초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료    
    if (!this.stateAA.isQuit) {      
      ToastAndroid.show('한번 더 누르면 종료합니다.', ToastAndroid.SHORT);
      this.stateAA.isQuit = true;

      this.timeout = setTimeout(() => {
        this.stateAA.isQuit = false;
      },2000);
      return true;
    } else {
      clearTimeout(this.timeout);
      BackHandler.exitApp();
    }
    return true;
  }

  componentDidUpdate(prevProps) {

    if(this.props.deviceToken != ""){            
      // console.log("토큰값 확인", this.props.deviceToken);
      this.webView.ref.postMessage(JSON.stringify({action: 'setToken', token: this.props.deviceToken}));
    }
  }

  // 이벤트 등록
  componentDidMount() {    
    setTimeout(() => {
        SplashScreen.hide();
    }, 1000);

    const confirmAlert = () => {
      this.webView.ref.postMessage(JSON.stringify({action: 'confirmAlert'}));
    };
    
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
      //앱 로딩페이지 2초 후 사라짐 
      setTimeout(() => {
        this.setState({
          isLoading: true
        })
      }, 2000);
    }

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("APP PUSH!");
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

    return unsubscribe;
  }

  // 이벤트 해제
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      this.exitApp = false;
      BackHandler.removeEventListener('hardwareBackPress');
      this.state.isLoading = false;
    }
  }

  render() {
  
    return (
      <WebView
        originWhitelist={['*']}
        source={{ uri: webUrl }}
        ref={(webView) => { this.webView.ref = webView; }}
        onNavigationStateChange={(navState) => {
          this.webView.currentUrl = navState.url;          
          // console.log("11==========", webUrl+"================"+this.webView.currentUrl);
          this.webView.canGoBack = navState.canGoBack;
        }}
      />
    );
  }
}

export default MyWebComponent