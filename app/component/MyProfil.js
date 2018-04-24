import React, { Component } from 'react';
import { View,Text,ToastAndroid,BackHandler,Dimensions,ScrollView,RefreshControl,CameraRoll,Modal,Image,Alert } from 'react-native';
import { Button,FormLabel,FormInput,Icon,Card,Avatar } from 'react-native-elements';
import axios from 'axios';
import { singleScreen,baseUrl,fKelamin,fAgama } from '../helper/stuff';
import ImagePicker from 'react-native-image-picker';
import {IconsMap, IconsLoaded} from '../helper/appIcon';

let widthScreen = Dimensions.get('window').width; //full width
let heightScreen = Dimensions.get('window').height; //full height

class Screen extends Component {
  
  static navigatorStyle = {
    navBarBackgroundColor: '#1abc9c',
    navBarHideOnScroll: true
  };

  constructor(props){
    super(props);
    this.state = {
      _token:'',
      data:'',
      refreshing: false,
      foto:[],
      uriFoto:'',
      fotoProfil:'',
      modalVisible: false
    };
    this.props.navigator.setOnNavigatorEvent(this.navBarEvent.bind(this));
    IconsLoaded;
  }

  componentDidMount(){
    axios.get(baseUrl+'getTokenS')
    .then( (r) => {
      this.setState({ _token: r.data });
    })
    .catch(function (error) {
      ToastAndroid.show('network eror', ToastAndroid.SHORT);
    });

    this.getDetailData();
  }

  navBarEvent = (e) => {
    if (e.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (e.id == 'edit') { // this is the same id field from the static navigatorButtons definition
        // ToastAndroid.show('Edit', ToastAndroid.SHORT);
        this.props.navigator.showModal({
          screen: 'EditMyProfil',
          title: 'Edit Profil',
          passProps: {
            profil: this.state.data
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
      } else if (e.id == 'logout') {
        Alert.alert(
          'Attantion !',
          'Are you sure to logout ?',
          [
            {text: 'Cancel', onPress: () => ToastAndroid.show('Logout cancel', ToastAndroid.SHORT), style: 'cancel'},
            {text: 'OK', onPress: () => this.logOut() }
          ],
          { cancelable: false }
        )        
      } else if (e.id == 'editFoto'){
        this.getPhotos();
      }
    }
  };

  getPhotos = () => {
    let options = {
      title: 'Change Photo',
      maxWidth: 5000, // photos only
      maxHeight: 5000, // photos only
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else { // after pick foto
        this.setState({
          fotoProfil: response,
          modalVisible: true
        });
      }
    });
  }

  uploadFotoProfil = (uri) => {
    var data=new FormData();
    data.append('key',this.state.data.nik)
    data.append('foto', {
      uri: uri,
      type: 'image/jpeg', // or photo.type
      name: 'dummy'
    });
    axios({
      method: 'post',
      url: baseUrl+'updateFotoMyProfileS',
      data,
      headers: {"X-CSRF-TOKEN": this.state._token}
    })
    .then( (r) => {
      if(r.data == true){
        ToastAndroid.show('Uploaded', ToastAndroid.SHORT);
        this.setState({ modalVisible: false });
        this.getDetailData();
      } 
    })
    .catch(function (error) {
      ToastAndroid.show('Error', ToastAndroid.SHORT);
      console.log(error);
    });
  }

  getDetailData = () => {
    this.setState({ refreshing: true });
    axios.get(baseUrl+'myProfileS')
    .then( (r) => {
      console.log(r);
      this.setState({ 
        data: r.data ,
        refreshing: false
      });
    })
    .catch(function (error) {
      ToastAndroid.show('network eror', ToastAndroid.SHORT);
    });
  }

  logOut = () => {
    axios({
      method: 'post',
      url: baseUrl+'logoutS',
      data: {
      },
      headers: {"X-CSRF-TOKEN": this.state._token}
    })
    .then(function (r) {
      ToastAndroid.show('Log Out', ToastAndroid.SHORT);
      singleScreen();
    })
    .catch(function (error) {
      ToastAndroid.show('Error', ToastAndroid.SHORT);
    });
  }

  render() {
    return (
      <ScrollView 
        style={{
           backgroundColor: '#ecf0f1',
           width: widthScreen,
           height: heightScreen
        }} 
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => this.getDetailData()}
            enable= {true}
          />
        } >
          <Card
            title='NIK'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {this.state.data.nik}
            </Text>
          </Card>
          <Card
            title='Nama'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {this.state.data.nama}
            </Text>
          </Card>
          <Card
            title='Username'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {this.state.data.username}
            </Text>
          </Card>
          <Card
            title='Password'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {this.state.data.password}
            </Text>
          </Card>
          <Card
            title='Jenis Kelamin'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {fKelamin(this.state.data.jenis_kelamin)}
            </Text>
          </Card>
          <Card
            title='Tempat Lahir'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {this.state.data.tempat_lahir}
            </Text>
          </Card>
          <Card
            title='Tanggal Lahir'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {this.state.data.tanggal_lahir}
            </Text>
          </Card>
          <Card
            title='Kota'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {this.state.data.nama_kota}
            </Text>
          </Card>
          <Card
            title='Alamat'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {this.state.data.alamat}
            </Text>
          </Card>
          <Card
            title='Agama'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {fAgama(this.state.data.agama)}
            </Text>
          </Card>
          <Card
            title='Pekerjaan'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {this.state.data.pekerjaan}
            </Text>
          </Card>
          <Card
            title='Telepon'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {this.state.data.tlp}
            </Text>
          </Card>
          <Card
            title='Email'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {this.state.data.email}
            </Text>
          </Card>
          <Card
            title='Foto'
            titleStyle={{
              textAlign: 'left',
              marginLeft:10
            }}
            image={{uri:baseUrl+'img/society/'+this.state.data.foto}}
            imageStyle={{width:330, height:270}}
          >
            <Text style={{marginBottom: 0}}>
              {this.state.data.foto}
            </Text>
          </Card>
          
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => console.log('close')}
            >
            <View 
              style={{
                backgroundColor:'rgba(0,0,0,0.7)',
                flex:1,
                 }} >
                <Icon
                  name='clear'
                  color='#ffffff' 
                  iconStyle={{alignSelf:'flex-end'}}
                  onPress={() => this.setState({ modalVisible: false })} />
                <Card
                  title='Foto'
                  image={{uri:'file://'+this.state.fotoProfil.path}} 
                  imageStyle={{width:330, height:270}}>
                  <Button
                    icon={{name: 'done'}}
                    backgroundColor='#03A9F4'
                    title='Save' 
                    onPress={() => this.uploadFotoProfil(this.state.fotoProfil.uri)}/>
                </Card>

            </View>
          </Modal>

      </ScrollView>
    );
  }
}

export default Screen;