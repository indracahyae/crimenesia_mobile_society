import React, { Component } from 'react';
import { View,Text, ToastAndroid,BackHandler,Dimensions,ScrollView,StyleSheet,Modal,RefreshControl } from 'react-native';
import { Button,FormLabel,FormInput,Icon,List,ListItem,Card } from 'react-native-elements';
import axios from 'axios';
import { baseUrl } from '../helper/stuff';
import ImagePicker from 'react-native-image-picker';

let widthScreen   = Dimensions.get('window').width; //full width
let heightScreen  = Dimensions.get('window').height; //full 

class Screen extends Component {
  
  static navigatorStyle = {
    navBarBackgroundColor: '#1abc9c',
  };

  constructor(props){
    super(props);
    this.state = {
      _token:'',
      keyIdKriminalitas:'',
      listBukti: [],
      modalDelete: false,
      refreshing: false,
      modalAddBukti: false,
      ket:'',
      fotoBukti:'',
      viewValidationMessage:[],
      modalValidation: false,
      modalEditBukti: false,
      selectBukti:'',
      uriEditFoto:'x',
      newFoto:''
    };
    this.props.navigator.setOnNavigatorEvent(this.navBarEvent.bind(this));
  }

  componentDidMount(){
    // ToastAndroid.show(this.props.keyIdKriminalitas.toString(), ToastAndroid.SHORT);
    axios.get(baseUrl+'getTokenS')
    .then( (r) => {
      this.setState({ _token: r.data });
    })
    .catch(function (error) {
      ToastAndroid.show('network eror', ToastAndroid.SHORT);
    });

    this.getListBukti();

  }

  navBarEvent = (e) => {
    if (e.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (e.id == 'add') { // this is the same id field from the static navigatorButtons definition
        this.getPhotos('add');
      }
    }
  };

  getListBukti = () => {
    axios.get(baseUrl+'listBuktiS/'+this.props.keyIdKriminalitas)
    .then( (r) => {
      this.setState({listBukti: []});
      this.setState({ listBukti: r.data });
    })
    .catch(function (error) {
      ToastAndroid.show('network eror', ToastAndroid.SHORT);
    });
  }

  onDeleteBukti = (key) => {
    this.setState({
      keyIdKriminalitas: key,
      modalDelete: true
    });
  }

  deleteBukti = (key) => {
    axios.get(baseUrl+'deleteBuktiS/'+key)
    .then( (r) => {
      if(r.data == true) {
        this.setState({ modalDelete: false })
        ToastAndroid.show('deleted', ToastAndroid.SHORT);
        this.getListBukti();
      }
    })
    .catch(function (error) {
      ToastAndroid.show('network eror', ToastAndroid.SHORT);
    });
  }

  getPhotos = (action) => {
    let options = {
      title: 'Select Avatar',
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
        switch(action){
            case 'add':
                this.setState({ 
                  fotoBukti: response,
                  modalAddBukti: true
                });
                this.textInputAddBuktiKet.focus();
                break;
            case 'edit':
                this.setState({
                  newFoto: 1,
                  fotoBukti: response,
                  uriEditFoto: 'file://'+response.path
                });
                break;
        }
      }
    });
  }

  addBukti = () => {
    var data=new FormData();
    data.append('id_kriminalitas',this.props.keyIdKriminalitas);
    data.append('ket',this.state.ket);
    data.append('foto', {
      uri: this.state.fotoBukti.uri,
      type: 'image/jpeg',
      name: 'dummy'
    });
    axios({
      method: 'post',
      url: baseUrl+'addBuktiS',
      data,
      headers: {"X-CSRF-TOKEN": this.state._token}
    })
    .then( (r) => {
      if(r.data == true){
        ToastAndroid.show('Saved', ToastAndroid.SHORT);
        this.setState({ 
          modalAddBukti: false,
          ket: ''
        });
        this.getListBukti();
      } 
    })
    .catch( (error) => {
      // ToastAndroid.show('Error', ToastAndroid.SHORT);
      // console.log(error.response.data);
      this.setState({ viewValidationMessage: [] });
      var obj = error.response.data;
      for (const prop in obj) {
        this.state.viewValidationMessage.push(
          <Text key={prop}> {obj[prop]}</Text>
        )
        this.setState({ viewValidationMessage: this.state.viewValidationMessage });
      }
      this.setState({
        modalValidation: true
      });
    });
  }

  selectBukti = (id) =>{
    axios.get(baseUrl+'selectBuktiS/'+id)
    .then( (r) => {
      this.setState({ 
        selectBukti: r.data,
        ket: r.data.ket,
        uriEditFoto: baseUrl+'img/crime/'+r.data.dokumen,
        newFoto:'',
        modalEditBukti: true
      });
    })
    .catch(function (error) {
      ToastAndroid.show('network eror', ToastAndroid.SHORT);
    });
  }

  editBukti = () =>{
    var data=new FormData();
    data.append('id',this.state.selectBukti.id);
    data.append('id_kriminalitas',this.state.selectBukti.id_kriminalitas);
    data.append('ket',this.state.ket);
    if(this.state.newFoto == ''){
      data.append('foto','');
    }else{
      data.append('foto', {
        uri: this.state.fotoBukti.uri,
        type: 'image/jpeg',
        name: 'dummy'
      });
    }
    axios({
      method: 'post',
      url: baseUrl+'updateBuktiS',
      data,
      headers: {"X-CSRF-TOKEN": this.state._token}
    })
    .then( (r) => {
      if(r.data == true){
        ToastAndroid.show('Updated', ToastAndroid.SHORT);
        this.setState({ 
          modalEditBukti: false,
          ket: ''
        });
        this.getListBukti();
      } 
    })
    .catch( (error) => {
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
            onRefresh={() => this.getListBukti()}
            enable= {true}
          />
        } >
            {this.state.listBukti.map((d) => (
              <Card
                  image={{uri:baseUrl+'img/crime/'+d.dokumen}}
                  key={d.id}
                  >
                  <Text style={{marginBottom: 10}}>
                      {d.ket}
                  </Text>
                  <View
                      style={{ 
                          justifyContent:'flex-end',
                          flexDirection:'row' 
                      }} >
                      <Icon
                          iconStyle={{
                              marginLeft:7
                          }}
                          size={17}	
                          name='mode-edit'
                          color='#7f8c8d' 
                          onPress={() => this.selectBukti(d.id)} />
                      <Icon
                          iconStyle={{
                              marginLeft:7
                          }}
                          size={17}
                          name='clear'
                          color='#7f8c8d' 
                          onPress={() => this.onDeleteBukti(d.id)} />
                  </View>
              </Card>
            ))}

            <View>
              <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.modalDelete}
                onRequestClose={() => console.log('close')}
                >
                <View 
                  style={{
                    backgroundColor:'rgba(0,0,0,0.7)',
                    flex:1,
                    }} >
                    <View 
                        style={{ 
                          justifyContent:'flex-end',
                          flexDirection:'row'
                        }} >
                        <Icon
                          name='clear'
                          color='#ffffff' 
                          underlayColor='rgba(0,0,0,0)'
                          iconStyle={{marginRight:15}}
                          onPress={() => this.setState({ modalDelete: false })} />
                        <Icon
                          name='done'
                          color='#ffffff' 
                          underlayColor='rgba(0,0,0,0)'
                          iconStyle={{marginRight:12}}
                          onPress={() => this.deleteBukti(this.state.keyIdKriminalitas)} />
                    </View>
                    <Card title="Delete Bukti"> 
                      <Text>Are you sure want to delete ?  </Text>
                    </Card>
                </View>
              </Modal>
            </View>

            <View>
              <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.modalAddBukti}
                onRequestClose={() => console.log('close')}
                >
                <View 
                  style={{
                    backgroundColor:'rgba(0,0,0,1)',
                    flex:1,
                    }} >
                    <View 
                        style={{ 
                          justifyContent:'flex-end',
                          flexDirection:'row'
                        }} >
                        <Icon
                          name='clear'
                          color='#ffffff' 
                          underlayColor='rgba(0,0,0,0)'
                          iconStyle={{marginRight:15}}
                          onPress={() => this.setState({ modalAddBukti: false })} />
                        <Icon
                          name='done'
                          color='#ffffff' 
                          underlayColor='rgba(0,0,0,0.9)'
                          iconStyle={{marginRight:12}}
                          onPress={() => this.addBukti()} />
                    </View>
                    
                    <FormLabel>Keterangan</FormLabel>
                    <FormInput 
                      value={this.state.ket}
                      multiline = {true}
                      numberOfLines = {3}
                      onChangeText={(ket) => this.setState({ ket })}
                      keyboardType='default' 
                      ref={(input) => { this.textInputAddBuktiKet= input; }} />
                    <Card
                      image={{uri:'file://'+this.state.fotoBukti.path}}
                      imageStyle={{height:475}}
                      >
                    </Card>
                </View>
              </Modal>
            </View>

            <View>
              <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.modalEditBukti}
                onRequestClose={() => console.log('close')}
                >
                <View 
                  style={{
                    backgroundColor:'rgba(0,0,0,1)',
                    flex:1,
                    }} >
                    <View 
                        style={{ 
                          justifyContent:'flex-end',
                          flexDirection:'row'
                        }} >
                        <Icon
                          name='image'
                          color='#ffffff' 
                          underlayColor='rgba(0,0,0,0)'
                          iconStyle={{marginRight:15}}
                          onPress={() => this.getPhotos('edit')} />
                        <Icon
                          name='clear'
                          color='#ffffff' 
                          underlayColor='rgba(0,0,0,0)'
                          iconStyle={{marginRight:15}}
                          onPress={() => this.setState({ modalEditBukti: false })} />
                        <Icon
                          name='done'
                          color='#ffffff' 
                          underlayColor='rgba(0,0,0,0.9)'
                          iconStyle={{marginRight:12}}
                          onPress={() => this.editBukti()} />
                    </View>
                    
                    <FormLabel>Keterangan</FormLabel>
                    <FormInput 
                      value={this.state.ket}
                      multiline = {true}
                      numberOfLines = {3}
                      onChangeText={(ket) => this.setState({ ket })}
                      keyboardType='default' 
                      ref={(input) => { this.textInputAddBuktiKet= input; }} />
                    <Card
                      image={{uri:this.state.uriEditFoto}}
                      imageStyle={{height:475}}
                      >
                    </Card>
                </View>
              </Modal>
            </View>

            <View>
              <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.modalValidation}
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
                      onPress={() => this.setState({ modalValidation: false })} />
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