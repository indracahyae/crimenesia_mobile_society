import React, { Component } from 'react';
import { View,Text, ToastAndroid,BackHandler,Dimensions,ScrollView,StyleSheet,RefreshControl } from 'react-native';
import { Button,FormLabel,FormInput,Icon,List,ListItem,Card } from 'react-native-elements';
import axios from 'axios';
import Modal from 'react-native-modal';
import { baseUrl,fValidasiLapor } from '../helper/stuff';
import {IconsMap, IconsLoaded} from '../helper/appIcon';

let widthScreen = Dimensions.get('window').width; //full width
let heightScreen = Dimensions.get('window').height; //full height

class Screen extends Component {
  
  static navigatorStyle = {
    navBarBackgroundColor: '#1abc9c',
  };

  constructor(props){
    super(props);
    this.state = {
      _token:'',
      dataLapor:'',
      refreshing: false
    };
    this.props.navigator.setOnNavigatorEvent(this.navBarEvent.bind(this));
    IconsLoaded;
  }

  componentDidMount(){
    this.getDetailLapor();
  }

  navBarEvent = (e) => {
    if (e.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (e.id == 'edit') { // this is the same id field from the static navigatorButtons definition
        this.props.navigator.showModal({
          screen: 'EditLapor',
          title: 'Edit Lapor',
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
          },
          passProps:{
            key_id_pengaduan: this.props.idPengaduan
          }
        });
      } else if (e.id == 'bukti') {
        this.props.navigator.showModal({
          screen: 'BuktiLapor',
          title: 'Bukti Lapor',
          passProps:{
            keyIdKriminalitas: this.state.dataLapor.id_kriminalitas
          },
          navigatorButtons: {
            rightButtons: [
              {
                icon: IconsMap['add'], // for icon button, provide the local image asset name
                buttonColor: '#2c3e50',
                id: 'add' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
              }
            ]
          }
        });
      }
    }
  };

  getDetailLapor = () => {
    axios.get(baseUrl+'detailLaporS/'+this.props.idPengaduan)
    .then( (r) => {
      this.setState({ dataLapor: r.data });
    })
    .catch(function (error) {
      ToastAndroid.show('error network code: '+error.response.status.toString(), ToastAndroid.SHORT)
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
            onRefresh={() => this.getDetailLapor()}
            enable= {true}
          />
        } >

          <Card containerStyle={{marginBottom:10}}>       
            <View style={{ marginBottom:10 }}>
              <Text style={{fontWeight: "bold"}}>Judul Kriminalitas</Text>
              <Text>{this.state.dataLapor.judul}</Text>
            </View>
            <View style={{ marginBottom:10 }}>
              <Text style={{fontWeight: "bold"}}>Waktu Pengaduan</Text>
              <Text>{this.state.dataLapor.waktu_pengaduan}</Text>
            </View>
            <View style={{ marginBottom:10 }}>
              <Text style={{fontWeight: "bold"}}>Validasi Pengaduan</Text>
              <Text>{fValidasiLapor(this.state.dataLapor.validasi_pengaduan)}</Text>
            </View>
            <View style={{ marginBottom:10 }}>
              <Text style={{fontWeight: "bold"}}>Kantor Polisi</Text>
              <Text>{this.state.dataLapor.nama_kantor}</Text>
            </View>
            <View style={{ marginBottom:10 }}>
              <Text style={{fontWeight: "bold"}}>Kota</Text>
              <Text>{this.state.dataLapor.nama_kota}</Text>
            </View>
            <View style={{ marginBottom:10 }}>
              <Text style={{fontWeight: "bold"}}>Alamat</Text>
              <Text>{this.state.dataLapor.alamat}</Text>
            </View>
            <View style={{ marginBottom:10 }}>
              <Text style={{fontWeight: "bold"}}>Tentang Pelaku</Text>
              <Text>{this.state.dataLapor.t_pelaku}</Text>
            </View>
            <View style={{ marginBottom:10 }}>
              <Text style={{fontWeight: "bold"}}>Tentang Korban</Text>
              <Text>{this.state.dataLapor.t_korban}</Text>
            </View>
            <View style={{ marginBottom:10 }}>
              <Text style={{fontWeight: "bold"}}>Deskripsi Kejadian</Text>
              <Text>{this.state.dataLapor.deskripsi_kejadian}</Text>
            </View>
            <View>
              <Text style={{fontWeight: "bold"}}>Kategori Kriminalitas</Text>
              <Text>{this.state.dataLapor.nama_kat_kriminalitas}</Text>
            </View>
          </Card>

      </ScrollView>
    );
  }
}

export default Screen;

{/* <Text> Detail Lapor {this.state.dataLapor.waktu_pengaduan}</Text> */}