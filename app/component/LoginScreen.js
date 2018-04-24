import React, { Component } from 'react';
import { View, ToastAndroid,BackHandler,Dimensions } from 'react-native';
import { Button,FormLabel,FormInput,Text } from 'react-native-elements';
import axios from 'axios';
import { tabScreen,baseUrl } from '../helper/stuff';
import Snackbar from 'react-native-snackbar';
import {IconsMap, IconsLoaded} from '../helper/appIcon';

let heightScreen = Dimensions.get('window').height; //full height

class Screen extends Component {

  constructor(props){
    super(props);
    this.state = {
      _token:'',
      nik:'',
      password:''
    };
    
  }

  componentDidMount(){
    axios.get(baseUrl+'getTokenS')
    .then( (r) => {
      this.setState({ _token: r.data });
    })
    .catch(function (error) {
      ToastAndroid.show('network eror', ToastAndroid.SHORT);
    });
  }

  loginProses = () => {
    axios({
      method: 'post',
      url: baseUrl+'loginS',
      data: {
        nik: this.state.nik,
        password: this.state.password
      },
      headers: {"X-CSRF-TOKEN": this.state._token}
    })
    .then( (r)=>{
      if(r.data == true){
        ToastAndroid.show('Log In', ToastAndroid.SHORT);
        tabScreen(this.state.nik);
      }else if(r.data == false){
        Snackbar.show({
          title: 'Log in Failed',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    })
    .catch( (error)=>{
      ToastAndroid.show('Error', ToastAndroid.SHORT);
    });
  }

  toSignUp = () => {
    this.props.navigator.showModal({
      screen: 'SignUp',
      title: 'Sign Up',
      passProps: {
        id: 'xx'
      },
      navigatorButtons: {
        rightButtons: [
            {
                icon: IconsMap['done'], // for icon button, provide the local image asset name
                buttonColor: '#2c3e50',
                id: 'save' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
            }
        ]
      }
    });
  }

  render() {
    return (
      <View 
        style={{
            backgroundColor: '#ecf0f1',
            height:heightScreen
          }} >
          <View
            style={{
              justifyContent:'center',
              flexDirection:'row',
              marginTop:30
            }} >
            <Text h3>Crimenesia</Text> 
            <Text style={{fontSize: 12}}>for public</Text>
          </View>
          
          <FormLabel>NIK</FormLabel>
          <FormInput 
            onChangeText={(nik) => this.setState({ nik })}
            keyboardType='numeric' />
          <FormLabel>Password</FormLabel>
          <FormInput 
            onChangeText={(password) => this.setState({ password })}
            secureTextEntry={true} />
          <Button
            raised
            containerViewStyle={{marginTop:10, borderRadius:22}}
            buttonStyle={{borderRadius:22, backgroundColor:'#1abc9c'}}
            title='Log In' 
            onPress={() => this.loginProses()} />
          
          <View 
            style={{ 
              justifyContent:'center',
              flexDirection:'row', 
              marginTop:5
            }} >
            <Text> Don't have an account? </Text> 
            <Text 
              style={{
                fontWeight: "bold"
              }}
              onPress={() => this.toSignUp()}> 
              Sign up. 
            </Text>
          </View>
      </View>
    );
  }
}

export default Screen;