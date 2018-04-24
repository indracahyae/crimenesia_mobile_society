import React, { Component } from 'react';
import { View,Text, ToastAndroid,BackHandler,Dimensions,ScrollView,StyleSheet,Picker,DatePickerAndroid,TimePickerAndroid,Modal } from 'react-native';
import { Button,FormLabel,FormInput,Icon,List,ListItem,Card } from 'react-native-elements';
import axios from 'axios';
import { baseUrl } from '../helper/stuff';
import MapView from 'react-native-maps';
import {IconsMap, IconsLoaded} from '../helper/appIcon';

let widthScreen = Dimensions.get('window').width; //full width
let heightScreen = Dimensions.get('window').height; //full height

class Screen extends Component {
  
  static navigatorStyle = {
    navBarBackgroundColor: '#1abc9c'    
  };

  constructor(props){
    super(props);
    this.state = {
      _token:'',
      id_kantor_polisi:'',
      nama_kantor_polisi:'',
      listKantorPolisi:[],
      judul:'',
      waktu:'',
      alamat:'',
      t_pelaku:'',
      t_korban:'',
      deskripsi_kejadian:'',
      list_kota:[],
      id_kota:'',
      id_provinsi:'',
      list_provinsi:[],
      list_kat_crime:[],
      id_kat_kriminalitas:'',
      labelProvinsi:'',
      labelKota:'',
      lat:'',
      long:'',
      tanggal_crime:'',
      jam_crime:'',
      waktu_crime:'',
      validationFormMessage:'',
      viewValidationMessage:[],
      modalVisible: false,
      modalMap: false,
      markerCrime: {latitude: 0,longitude: 0},
      region: {
        latitude: -7.249731,
        longitude: 112.752193,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      lastRegion: {
        latitude: -7.249731,
        longitude: 112.752193,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
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
    this.getListKantorPolisi();
    this.getListProvinsi();
    this.getKatCrime();
  }

  navBarEvent = (e) => {
    if (e.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (e.id == 'save') { // this is the same id field from the static navigatorButtons definition
        this.createLapor();
      }if ( e.id == 'crimePosition') {
        this.getLatLong();
      }
    }
  };

  createLapor = () =>{
    if (this.state.alamat == ''){
      ToastAndroid.show('tempat kejadian belum ditentukan', ToastAndroid.SHORT);
    }else{
      axios({
        method: 'post',
        url: baseUrl+'createLaporS',
        data: {
          id_kantor_polisi: this.state.id_kantor_polisi,
          judul: this.state.judul,
          alamat: this.state.alamat,
          t_pelaku: this.state.t_pelaku,
          t_korban: this.state.t_korban,
          deskripsi_kejadian: this.state.deskripsi_kejadian,
          id_kota: this.state.id_kota,
          id_kat_kriminalitas: this.state.id_kat_kriminalitas,
          lat : this.state.lat,
          long: this.state.long,
          waktu: this.state.tanggal_crime+' '+this.state.jam_crime
        },
        headers: {"X-CSRF-TOKEN": this.state._token}
      })
      .then( (r) => {
        // send fcm
        var dataFcm = JSON.stringify({data:{idPengaduan:r.data},notification: { title: this.state.judul, body: this.state.alamat, sound: "default"}, to:"/topics/"+this.topics(this.state.nama_kantor_polisi)});
        axios({
          method: 'post',
          url: 'https://fcm.googleapis.com/fcm/send',
          data: dataFcm,
          headers: {
            "Content-type": "application/json",
            "Authorization":"key=AAAAU1c0Nxg:APA91bGESrQVcSBEDCPDVPNA9nkyJVO9lIbSVfG6QRZHqhlV3b1ictNxxr3Hv6RaDRuQ_JBL1msN-pq0zN_kc90fuuVyvCRxP32uIZe0FizQWhgZQMNwBhwYiuPlY-ezdEieY9MUiZbi"
          }
        })
        .then( (r) => {
          ToastAndroid.show('Saved', ToastAndroid.SHORT);
          this.props.navigator.dismissModal({
            animationType: 'slide-down' 
          });
        })
        .catch( (error)=>{
          console.log(error);
        });        
      })
      .catch( (error) => {
        // ToastAndroid.show('Error code: '+error.response.status.toString(), ToastAndroid.SHORT);
        this.setState({ viewValidationMessage: [] });
        var obj = error.response.data;
        for (const prop in obj) {
          this.state.viewValidationMessage.push(
            <Text key={prop}> {obj[prop]}</Text>
          )
          this.setState({ viewValidationMessage: this.state.viewValidationMessage });
        }
        this.setState({
          modalVisible: true
        });
      });
    }
  }

  getListKantorPolisi = () => {
    axios.get(baseUrl+'listKantorPolisiS')
    .then( (r) => {
      this.setState({
        listKantorPolisi: r.data
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  getListProvinsi = () => {
    axios.get(baseUrl+'listProvinsiS')
    .then( (r) => {
      this.setState({
        list_provinsi: r.data
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  getListKota = (id,index) => {
    this.setState({id_provinsi: id, labelProvinsi: this.state.list_provinsi[index].nama})
    axios.get(baseUrl+'listKotaS/'+id)
    .then( (r) => {
      this.setState({
        list_kota: r.data
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  getKatCrime = () => {
    axios.get(baseUrl+'listKatCrimeS')
    .then( (r) => {
      this.setState({
        list_kat_crime: r.data
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  // get lat long
  getLatLong = () => {
    this.setState({
      modalMap: true,
      region: this.state.lastRegion
    });    

    // var address = this.state.alamat+' '+this.state.labelKota +' '+this.state.labelProvinsi;
    // var geoCodeUrl= 'http://maps.google.com/maps/api/geocode/json?address=';
    // axios.get(geoCodeUrl+address)
    // .then( (r) => {
    //   // console.log(r.data.results[0].geometry.location);
    //   var lat = r.data.results[0].geometry.location.lat;
    //   var long = r.data.results[0].geometry.location.lng;
    //   this.setState({
    //     lat: lat,
    //     long: long
    //   });
    //   ToastAndroid.show(address+'. Latitude: '+lat +', Longitude: '+long, ToastAndroid.LONG);
    // })
    // .catch(function (error) {
    //   ToastAndroid.show('Lengkapi Alamat, provinsi, kota', ToastAndroid.LONG);
    // });
  }

  markerCrime = (e) => {
    // ToastAndroid.show(JSON.stringify(e.nativeEvent.coordinate), ToastAndroid.LONG);
    this.setState({
      lat:e.nativeEvent.coordinate.latitude,
      long:e.nativeEvent.coordinate.longitude,
      markerCrime: e.nativeEvent.coordinate,
      lastRegion: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    });
  }

  getTempatKejadian = (lat,long)=>{
    var url= 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long+'&key=AIzaSyBmIoVBBNREisW3prcdsBCI0BGXHGzVdYA';
    axios.get(url)
    .then( (r) => {
      this.setState({
        alamat: r.data.results[0].formatted_address,
        modalMap: false
      });
      ToastAndroid.show('TKP didapatkan', ToastAndroid.LONG);
    })
    .catch( (error)=>{
      ToastAndroid.show('masalah jaringan atau coba pilih tempat lain, COBA LAGI.', ToastAndroid.LONG);
    });
  }

  posisiSaya = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // var lat = position.coords.latitude;
        // var long = position.coords.longitude;
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude,
          markerCrime: position.coords,
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
          lastRegion: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        });
      }, 
      (error) => {
        ToastAndroid.show(error.message, ToastAndroid.SHORT)
      }, 
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    );
  }

  // tanggal crime
  _openDatePicker = async () => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {

      } 
      if(action == DatePickerAndroid.dateSetAction){
        var d = year+'-'+(month+1)+'-'+day;
        this.setState({ tanggal_crime: d });
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  };

  // jam crime
  _openTimePicker = async() => {
    try {
      const {action, hour, minute} = await TimePickerAndroid.open({
       
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        var jam = hour +':'+ minute;
        this.setState({ jam_crime: jam });
      }
      if (action !== TimePickerAndroid.timeSetAction) {
        // canceled action
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }
  }

  topics = (str)=>{   // untuk send fcm
    str = str.split(" ");
    var arrLength = str.length;
    var name='';
    for (var i = 0; i < arrLength-1; i++) { 
        name += str[i+1];
    }
    console.log(name);
    return name.toLowerCase();
    // str = str[0]+str[1];
    // console.log(str);
  }

  render() {
    return (
      <ScrollView 
        style={{
           backgroundColor: '#ecf0f1',
           width: widthScreen,
           height: heightScreen
        }} >

            <FormLabel>Kantor Polisi</FormLabel>
            <Picker
              style={{marginLeft:12,color:'#34495e'}}
              selectedValue={this.state.id_kantor_polisi}
              onValueChange={(itemValue, itemIndex) => {this.setState({id_kantor_polisi: itemValue, nama_kantor_polisi:this.state.listKantorPolisi[itemIndex].nama_kantor});this.topics(this.state.listKantorPolisi[itemIndex].nama_kantor);}}>
                {this.state.listKantorPolisi.map((d) => (
                  <Picker.Item key={d.id} label={d.nama_kantor} value={d.id} />
                ))} 
            </Picker>
            <FormLabel>Judul Kriminalitas</FormLabel>
            <FormInput 
              onChangeText={(judul) => this.setState({ judul })}
              keyboardType='default' />
            <FormLabel>Tempat Kejadian</FormLabel>
            <FormInput 
              multiline = {true}
              numberOfLines = {3}
              value={this.state.alamat}
              editable={false}/>
            <FormLabel>Provinsi Kejadian</FormLabel>
            <Picker
              style={{marginLeft:12,color:'#34495e'}}
              selectedValue={this.state.id_provinsi}
              onValueChange={(itemValue, itemIndex) => this.getListKota(itemValue,itemIndex)}>
              {this.state.list_provinsi.map((d) => (
                <Picker.Item key={d.id} label={d.nama} value={d.id} />
              ))} 
            </Picker>
            <FormLabel>Kota Kejadian</FormLabel>
            <Picker
              style={{marginLeft:12,color:'#34495e'}}
              selectedValue={this.state.id_kota}
              onValueChange={(itemValue, itemIndex) => this.setState({id_kota: itemValue, labelKota: this.state.list_kota[itemIndex].nama})}>
              {this.state.list_kota.map((d) => (
                <Picker.Item key={d.id} label={d.nama} value={d.id} />
              ))} 
            </Picker>
            <FormLabel>Kejahatan Terhadap (Kategori Kriminalitas):</FormLabel>
            <Picker
              style={{marginLeft:12,color:'#34495e'}}
              selectedValue={this.state.id_kat_kriminalitas}
              onValueChange={(itemValue, itemIndex) => this.setState({id_kat_kriminalitas: itemValue})}>
              {this.state.list_kat_crime.map((d) => (
                <Picker.Item key={d.id} label={d.nama} value={d.id} />
              ))} 
            </Picker>

            <FormLabel>Tentang Pelaku</FormLabel>
            <FormInput 
              multiline = {true}
              numberOfLines = {3}
              onChangeText={(t_pelaku) => this.setState({ t_pelaku })}
              keyboardType='default' />
            <FormLabel>Tentang Korban</FormLabel>
            <FormInput 
              multiline = {true}
              numberOfLines = {3}
              onChangeText={(t_korban) => this.setState({ t_korban })}
              keyboardType='default' />
            <FormLabel>Deskripsi Kejadian</FormLabel>
            <FormInput 
              multiline = {true}
              numberOfLines = {3}
              onChangeText={(deskripsi_kejadian) => this.setState({ deskripsi_kejadian })}
              keyboardType='default' />
            
            <View
              style={{ 
                    marginLeft:15
                  }} >
              <Text >
                Tanggal Kejadian : {this.state.tanggal_crime}
              </Text>
              <Icon
                raised
                size={20}
                name='date-range'
                color='#7f8c8d'
                onPress={() => this._openDatePicker()}
              />
          </View>
          <View
              style={{ 
                    marginLeft:15
                  }} >
              <Text >
                Jam Kejadian : {this.state.jam_crime}
              </Text>
              <Icon
                raised
                size={20}
                name='access-time'
                color='#7f8c8d'
                onPress={() => this._openTimePicker()}
              />
          </View>

          <View>
            <Modal
              animationType="fade"
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
                      <Card title="Form Validation Message"> 
                        {this.state.viewValidationMessage}
                      </Card>
              </View>
            </Modal>
          </View>

          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalMap}
              onRequestClose={() => console.log('close')}
              >
                <View style ={styles.container}>
                  <MapView
                    initialRegion={this.state.region}
                    region={this.state.region}
                    provider='google'
                    style={styles.map}
                    showsUserLocation={true}
                    showsCompass={true}
                    followsUserLocation={true}
                    onLongPress={(e) => {this.markerCrime(e)}}
                    onRegionChange={(e) => {this.setState({region:e.nativeEvent})}}
                  >

                    <MapView.Marker
                      key={0}
                      coordinate={this.state.markerCrime}
                      title='tempat kejadian'   
                      pinColor='blue'
                    />

                  </MapView>
                  <View 
                    style={{ 
                      justifyContent:'flex-end',
                      flexDirection:'row',
                      marginTop: 5
                    }} >
                    <Icon
                      name='clear'
                      color='#000000'
                      underlayColor='rgba(0,0,0,0)' 
                      iconStyle={{marginRight:15}}
                      onPress={() => this.setState({ modalMap: false })} />
                    <Icon
                      name='my-location'
                      color='#000000' 
                      underlayColor='rgba(0,0,0,0)'
                      iconStyle={{marginRight:15}} 
                      onPress={() => this.posisiSaya()} />
                    <Icon
                      name='done'
                      color='#000000' 
                      underlayColor='rgba(0,0,0,0)'
                      iconStyle={{marginRight:15}}
                      onPress={() => this.getTempatKejadian(this.state.lat,this.state.long)} />
                  </View>
                </View>
            </Modal>
          </View>

      </ScrollView>
    );
  }
}

export default Screen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
