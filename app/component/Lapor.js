import React, { Component } from 'react';
import { View,Text, ToastAndroid,BackHandler,Dimensions,ScrollView,StyleSheet,Alert, Vibration } from 'react-native';
import { Button,FormLabel,FormInput,Icon,List,ListItem,Card } from 'react-native-elements';
import axios from 'axios';
import Modal from 'react-native-modal';
import { baseUrl,fValidasiLapor } from '../helper/stuff';
import Snackbar from 'react-native-snackbar';
import {IconsMap, IconsLoaded} from '../helper/appIcon';
import firebase from 'react-native-firebase';

let widthScreen = Dimensions.get('window').width; //full width
let heightScreen = Dimensions.get('window').height; //full height

let styles = StyleSheet.create({
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5
  },
  ratingImage: {
    height: 19.21,
    width: 100
  },
  ratingText: {
    paddingLeft: 0,
    color: 'grey'
  }
});

class Screen extends Component {
  
  static navigatorStyle = {
    navBarBackgroundColor: '#1abc9c',
    navBarHideOnScroll: true
  };

  constructor(props){
    super(props);
    this.state = {
      _token:'',
      modalPressMenuList:false,
      listLapor:[],
      selectPengaduan:''
    };
    this.props.navigator.setOnNavigatorEvent(this.navBarEvent.bind(this));
    IconsLoaded;
    
  }

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true // do not exit app
    });
    this.getListLapor();

    // send token Masyarakat
    firebase.messaging().getToken()
    .then((fbToken)=>{
      // console.log(token)
      firebase.database().ref("masyarakat").child(this.props.userNik).set({ 
        id: this.props.userNik,
        token: fbToken
      });
    });

    // handle receive fcm
    firebase.messaging().onMessage((payload)=>{
      
      // when apps running
      if(!payload.hasOwnProperty('opened_from_tray')){
        this.getListLapor();
        Vibration.vibrate(5000, false);
        Snackbar.show({
          title: 'Periksa Laporan Anda',
          duration: Snackbar.LENGTH_INDEFINITE,
          action: {
            title: 'OK',
            color: 'green',
            onPress: () => { 
              // console.log("onMessage: ",payload);
              this.setState({ selectPengaduan: payload.idPengaduan });
              this.detailLapor();
            }
          }
        });
      }

      // when apps in background
      if(payload.hasOwnProperty('google.message_id')){
        // console.log("notifPopUpClick: ",payload);
        this.setState({ selectPengaduan: payload.idPengaduan });
        this.detailLapor();
      }
    });

  }

  navBarEvent = (e) => {
    if (e.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (e.id == 'reload') { // this is the same id field from the static navigatorButtons definition
        Snackbar.show({
          title: 'Reload',
          duration: Snackbar.LENGTH_SHORT,
        });
        this.getListLapor();
      } else if (e.id == 'add') {
        this.props.navigator.showModal({
          screen: 'AddLapor',
          title: 'Create Lapor',
          navigatorButtons: {
            rightButtons: [
              {
                icon: IconsMap['done'], // for icon button, provide the local image asset name
                buttonColor: '#2c3e50',
                id: 'save' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
              },
              {
                icon: IconsMap['myLocation'], // for icon button, provide the local image asset name
                buttonColor: '#2c3e50',
                id: 'crimePosition' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
              }
            ]
          }
        });
      } 
    }
  };

  pressMenu_List = (id_pengaduan) => {
    this.setState({ 
      modalPressMenuList: true,
      selectPengaduan: id_pengaduan
    })
  }

  alertDelete = () => {
    Alert.alert(
      'Delete Lapor',
      'Are you sure ?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => this.deleteLapor()}
      ],
      { cancelable: false }
    )
  }

  deleteLapor = () => {
    // ToastAndroid.show('delete '+this.state.selectPengaduan, ToastAndroid.SHORT)
    axios.get(baseUrl+'deleteLaporS/'+ this.state.selectPengaduan)
    .then( (r) => {
      this.getListLapor();
      this.setState({ modalPressMenuList: false });
      ToastAndroid.show('delete success', ToastAndroid.SHORT)
    })
    .catch(function (error) {
      ToastAndroid.show('error network code: '+error.response.status.toString(), ToastAndroid.SHORT)
    });
  }

  detailLapor = () => {
    this.setState({ modalPressMenuList: false });
    this.props.navigator.showModal({
      screen: 'DetailLapor',
      title: 'Detail Lapor',
      passProps: {
        idPengaduan: this.state.selectPengaduan
      },
      navigatorButtons: {
        rightButtons: [
          {
            icon: IconsMap['edit'], // for icon button, provide the local image asset name
            buttonColor: '#2c3e50',
            id: 'edit' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
          },
          {
            icon: IconsMap['image'], // for icon button, provide the local image asset name
            buttonColor: '#2c3e50',
            id: 'bukti' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
          }
        ]
      }
    });
  }

  getListLapor = () => {
    axios.get(baseUrl+'listLaporS')
    .then( (r) => {
      this.setState({listLapor: []});
      this.setState({
        listLapor: r.data,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  colorValidasi = (d) => {
    switch(d){
      case 0:
          return "#e74c3c"; // tdk valid : merah
          break;
      case 1:
          return "#2ecc71"; // valid : hijau
          break;
      case 2:
          return "#3498db"; // dalam pemeriksaan : biru
          break;
      case 3:
          return "#2c3e50"; //belum diperiksa : hitam
          break;
    }
  }

  infoValidasi = (d) => {
    Snackbar.show({
      title: fValidasiLapor(d),
      duration: Snackbar.LENGTH_SHORT
    });
  }

  render() {
    return (
      <ScrollView 
        style={{
           backgroundColor: '#ecf0f1',
           width: widthScreen,
           height: heightScreen
        }} >

          <List>
            {this.state.listLapor.map((d) => (
              <ListItem
                key={d.id_pengaduan}
                title={d.nama_kantor}
                rightIcon={{
                  color: this.colorValidasi(d.validasi_pengaduan),
                  name: 'info-outline'
                }}
                subtitle={
                  <View style={styles.subtitleView}>
                    <Text style={styles.ratingText}>{d.waktu_pengaduan}</Text>
                  </View>
                }
                onPress={() => this.pressMenu_List(d.id_pengaduan) }
                onPressRightIcon={() => this.infoValidasi(d.validasi_pengaduan)}
              />
            ))}
          </List>          
          
        <Modal 
          isVisible={this.state.modalPressMenuList}
          onBackdropPress={() => this.setState({ modalPressMenuList: false })}
        >
          <Card containerStyle={{padding: 0}} >
            <ListItem
              hideChevron={true}
              key='1'
              title='Detail'
              onPress={() => this.detailLapor()}
            />
            <ListItem
            hideChevron={true}
              key='2'
              title='Delete'
              onPress={() => this.alertDelete()}
            />
          </Card>
        </Modal>
      </ScrollView>
    );
  }
}

export default Screen;

// avatar={{uri:baseUrl+'img/society/'+d.foto}}