import React, { Component } from 'react';
import { View,Text, ToastAndroid,BackHandler,Dimensions,ScrollView,Picker,DatePickerAndroid } from 'react-native';
import { Button,FormLabel,FormInput,Icon } from 'react-native-elements';
import axios from 'axios';
import { baseUrl } from '../helper/stuff';

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
      nik:'',
      username:'',
      password:'',
      nama:'',
      jenis_kelamin:1,
      tempat_lahir:'',
      alamat:'',
      agama:0,
      pekerjaan:'',
      tlp:'',
      email:'',
      tanggal_lahir:'',
      id_kota:1101,
      list_kota:[],
      list_provinsi:[],
      id_provinsi:11
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

    this.getListProvinsi();
  }

  navBarEvent = (e) => {
    if (e.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (e.id == 'save') { // this is the same id field from the static navigatorButtons definition
        this.submitForm();
      }
    }
  };

  submitForm = () => {
    axios({
      method: 'post',
      url: baseUrl+'signUpS',
      data: {
        nik: this.state.nik,
        username: this.state.username,
        password: this.state.password,
        nama: this.state.nama,
        jenis_kelamin: this.state.jenis_kelamin,
        tempat_lahir: this.state.tempat_lahir,
        alamat: this.state.alamat,
        agama: this.state.agama,
        pekerjaan: this.state.pekerjaan,
        tlp: this.state.tlp,
        email: this.state.email,
        tanggal_lahir: this.state.tanggal_lahir,
        id_kota: this.state.id_kota
      },
      headers: {"X-CSRF-TOKEN": this.state._token}
    })
    .then( (r) => {
      if(r.data == true){
        ToastAndroid.show('Saved', ToastAndroid.SHORT);
        this.props.navigator.dismissModal({
          animationType: 'slide-down' 
        });
      } else if(r.data == 2){
        ToastAndroid.show('Use another NIK', ToastAndroid.SHORT);
      } else if(r.data == 3){
        ToastAndroid.show('Use another Username', ToastAndroid.SHORT);
      } else if(r.data == 4){
        ToastAndroid.show('Use another Email', ToastAndroid.SHORT);
      }
    })
    .catch(function (error) {
      ToastAndroid.show('Error', ToastAndroid.SHORT);
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
        this.setState({ tanggal_lahir: d });
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  };

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
    this.setState({id_provinsi: id})
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

  render() {
    return (
      <ScrollView 
        style={{
            backgroundColor: '#ecf0f1'
          }} >
            <FormLabel>NIK</FormLabel>
            <FormInput 
              onChangeText={(nik) => this.setState({ nik })}
              keyboardType='numeric' />
            <FormLabel>Username</FormLabel>
            <FormInput 
              onChangeText={(username) => this.setState({ username })}
              keyboardType='default' />
            <FormLabel>Password</FormLabel>
            <FormInput 
              onChangeText={(password) => this.setState({ password })}
              keyboardType='default' />
            <FormLabel>Nama</FormLabel>
            <FormInput 
              onChangeText={(nama) => this.setState({ nama })}
              keyboardType='default' />
            <FormLabel>Jenis Kelamin</FormLabel>
            <Picker
              style={{marginLeft:12,color:'#34495e'}}
              selectedValue={this.state.jenis_kelamin}
              onValueChange={(itemValue, itemIndex) => this.setState({jenis_kelamin: itemValue})}>
              <Picker.Item label="Laki-laki" value="1" />
              <Picker.Item label="Perempuan" value="2" />
            </Picker>
            <FormLabel>Tempat Lahir</FormLabel>
            <FormInput 
              onChangeText={(tempat_lahir) => this.setState({ tempat_lahir })}
              keyboardType='default' />
            <View
              style={{ 
                    marginLeft:15
                  }} >
              <Icon
                raised
                size={20}
                name='date-range'
                color='#7f8c8d'
                onPress={() => this._openDatePicker()}
              />
              <Text >
                Tanggal Lahir : {this.state.tanggal_lahir}
              </Text>
            </View>
            <FormLabel>Alamat</FormLabel>
            <FormInput 
              onChangeText={(alamat) => this.setState({ alamat })}
              keyboardType='default' />
            <FormLabel>Provinsi</FormLabel>
            <Picker
              style={{marginLeft:12,color:'#34495e'}}
              selectedValue={this.state.id_provinsi}
              onValueChange={(itemValue, itemIndex) => this.getListKota(itemValue)}>
              {this.state.list_provinsi.map((d) => (
                <Picker.Item key={d.id} label={d.nama} value={d.id} />
              ))} 
            </Picker>
            <FormLabel>Kota</FormLabel>
            <Picker
              style={{marginLeft:12,color:'#34495e'}}
              selectedValue={this.state.id_kota}
              onValueChange={(itemValue, itemIndex) => this.setState({id_kota: itemValue})}>
              {this.state.list_kota.map((d) => (
                <Picker.Item key={d.id} label={d.nama} value={d.id} />
              ))} 
            </Picker>
            <FormLabel>Agama</FormLabel>
            <Picker
              style={{marginLeft:12,color:'#34495e'}}
              selectedValue={this.state.agama}
              onValueChange={(itemValue, itemIndex) => this.setState({agama: itemValue})}>
              <Picker.Item label="Islam" value="0" />
              <Picker.Item label="Kristen" value="1" />
              <Picker.Item label="Hindu" value="2" />
              <Picker.Item label="Buddha" value="3" />
              <Picker.Item label="Konghucu" value="4" />
            </Picker>
            <FormLabel>Pekerjaan</FormLabel>
            <FormInput 
              onChangeText={(pekerjaan) => this.setState({ pekerjaan })}
              keyboardType='default' />
            <FormLabel>Tlp.</FormLabel>
            <FormInput 
              onChangeText={(tlp) => this.setState({ tlp })}
              keyboardType='numeric' />
            <FormLabel>Email</FormLabel>
            <FormInput 
              onChangeText={(email) => this.setState({ email })}
              keyboardType='email-address' />
      </ScrollView>
    );
  }
}

export default Screen;