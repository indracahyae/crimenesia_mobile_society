import React, { Component } from 'react';
import { View,Text, ToastAndroid,BackHandler,Dimensions,ScrollView,StyleSheet,Picker,DatePickerAndroid,TimePickerAndroid,Modal } from 'react-native';
import { Button,FormLabel,FormInput,Icon,List,ListItem,Card } from 'react-native-elements';
import axios from 'axios';
import { baseUrl } from '../helper/stuff';

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
      judul: '',
      alamat: '',
      id_kantor_polisi:'',
      listKantorPolisi:[],
      id_kota:'',
      list_kota:[],
      id_provinsi:'',
      list_provinsi:[],
      labelProvinsi:'',
      labelKota: '',
      id_kat_kriminalitas: '',
      list_kat_crime: [],
      t_pelaku:'',
      t_korban: '',
      deskripsi_kejadian: '',
      tanggal_crime:'',
      jam_crime:'',
      labelKota:'',
      labelProvinsi:'',
      lat:'',
      long:'',
      getCrimePosition: 0,
      modalVisible: false,
      viewValidationMessage: []
    };
    this.props.navigator.setOnNavigatorEvent(this.navBarEvent.bind(this));
  }

  componentDidMount(){
    axios.get(baseUrl+'getTokenS')
    .then( (r) => {
      this.setState({ _token: r.data });
    })
    .catch(function (error) {
      ToastAndroid.show('network eror', ToastAndroid.SHORT);
    });

    this.getDetailLapor();
    this.getListKantorPolisi();
    this.getListProvinsi();
    this.getKatCrime();
  }

  navBarEvent = (e) => {
    if (e.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (e.id == 'save') { // this is the same id field from the static navigatorButtons definition
        this.updateLapor();
      } else if(e.id == 'crimePosition'){
        this.getLatLong();
      }
    }
  };

  getDetailLapor = () => {
    axios.get(baseUrl+'detailLaporS/'+this.props.key_id_pengaduan)
    .then( (r) => {
      // this.setState({ dataLapor: r.data });
      var data = r.data;
      var waktu_crime = data.waktu_kriminalitas.split(" ");
      
      this.setState({ 
        id_kantor_polisi: data.id_kantor_polisi,
        judul: data.judul,
        alamat: data.alamat,
        id_provinsi: data.id_provinsi,
        id_kota: data.id_kota,
        id_kat_kriminalitas: data.id_kat_kriminalitas,
        t_pelaku: data.t_pelaku,
        t_korban: data.t_korban,
        deskripsi_kejadian: data.deskripsi_kejadian,
        tanggal_crime: waktu_crime[0],
        jam_crime: waktu_crime[1],
        labelKota: data.nama_kota,
        labelProvinsi: data.nama_provinsi
      });
      this.getListKota(data.id_provinsi);
    })
    .catch(function (error) {
      ToastAndroid.show('error network code: '+error.response.status.toString(), ToastAndroid.SHORT)
    });
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

  getListKota = (id) => {
    this.setState({id_provinsi: id});
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

  getLatLong = () => {
    var address = this.state.alamat+' '+this.state.labelKota +' '+this.state.labelProvinsi;
    var geoCodeUrl= 'http://maps.google.com/maps/api/geocode/json?address=';
    this.setState({getCrimePosition: 0});
    axios.get(geoCodeUrl+address)
    .then( (r) => {
      var lat = r.data.results[0].geometry.location.lat;
      var long = r.data.results[0].geometry.location.lng;
      this.setState({
        lat: lat,
        long: long,
        getCrimePosition: 1
      });
      ToastAndroid.show(address+'. Latitude: '+lat +', Longitude: '+long, ToastAndroid.LONG);
    })
    .catch(function (error) {
      ToastAndroid.show('Lengkapi Alamat, provinsi, kota', ToastAndroid.LONG);
    });
  }

  updateLapor = () =>{
    if (this.state.getCrimePosition == 0){
      ToastAndroid.show('Can not save, click crime position in top Bar Button', ToastAndroid.LONG);
    }else{
      axios({
        method: 'post',
        url: baseUrl+'updateLaporS',
        data: {
          key_id_pengaduan: this.props.key_id_pengaduan,
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
        if(r.data == true){
          ToastAndroid.show('Saved', ToastAndroid.SHORT);
          this.props.navigator.dismissModal({
            animationType: 'slide-down' 
          });
        } 
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
              onValueChange={(itemValue, itemIndex) => this.setState({id_kantor_polisi: itemValue})}>
                {this.state.listKantorPolisi.map((d) => (
                  <Picker.Item key={d.id} label={d.nama_kantor} value={d.id} />
                ))} 
            </Picker>
            <FormLabel>Judul Kriminalitas</FormLabel>
            <FormInput 
              value={this.state.judul}
              onChangeText={(judul) => this.setState({ judul })}
              keyboardType='default' />
            <FormLabel>Alamat</FormLabel>
            <FormInput 
              value={this.state.alamat}
              onChangeText={(alamat) => this.setState({ alamat })}
              keyboardType='default' />
            <FormLabel>Provinsi</FormLabel>
            <Picker
              style={{marginLeft:12,color:'#34495e'}}
              selectedValue={this.state.id_provinsi}
              onValueChange={(itemValue, itemIndex) => {this.getListKota(itemValue); this.setState({labelProvinsi: this.state.list_provinsi[itemIndex].nama});}}>
              {this.state.list_provinsi.map((d) => (
                <Picker.Item key={d.id} label={d.nama} value={d.id} />
              ))} 
            </Picker>
            <FormLabel>Kota</FormLabel>
            <Picker
              style={{marginLeft:12,color:'#34495e'}}
              selectedValue={this.state.id_kota}
              onValueChange={(itemValue, itemIndex) => this.setState({id_kota: itemValue, labelKota: this.state.list_kota[itemIndex].nama})}>
              {this.state.list_kota.map((d) => (
                <Picker.Item key={d.id} label={d.nama} value={d.id} />
              ))} 
            </Picker>
            <FormLabel>Kategori Kriminalitas</FormLabel>
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
              value={this.state.t_pelaku}
              multiline = {true}
              numberOfLines = {3}
              onChangeText={(t_pelaku) => this.setState({ t_pelaku })}
              keyboardType='default' />
            <FormLabel>Tentang Korban</FormLabel>
            <FormInput 
              value={this.state.t_korban}
              multiline = {true}
              numberOfLines = {3}
              onChangeText={(t_korban) => this.setState({ t_korban })}
              keyboardType='default' />
            <FormLabel>Deskripsi Kejadian</FormLabel>
            <FormInput 
              value={this.state.deskripsi_kejadian}
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

      </ScrollView>
    );
  }
}

export default Screen;