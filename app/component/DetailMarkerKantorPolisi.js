import React, { Component } from 'react';
import { View,Text, ToastAndroid,BackHandler,Dimensions,ScrollView,StyleSheet } from 'react-native';
import { Button,FormLabel,FormInput,Icon,Card,List,ListItem } from 'react-native-elements';
import axios from 'axios';
import { baseUrl } from '../helper/stuff';

let widthScreen = Dimensions.get('window').width; //full width
let heightScreen = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
    subtitleView: {
      flexDirection: 'row',
      paddingLeft: 10,
      paddingTop: 5
    },
    ratingText: {
      paddingLeft: 0,
      color: 'grey'
    }
  });

class Screen extends Component {
  
  static navigatorStyle = {
    navBarBackgroundColor: '#1abc9c'    
  };

  constructor(props){
    super(props);
    this.state = {
      _token:'',
      data:[]
    };
  }

  componentDidMount(){
    this.setState({ data: this.props.data });   
  }

  render() {
    return (
        <ScrollView 
        style={{
           backgroundColor: '#ecf0f1',
           width: widthScreen,
           height: heightScreen
        }} >

          <Card containerStyle={{marginBottom:10}}>       
            <View style={{ marginBottom:10 }}>
              <Text style={{fontWeight: "bold"}}>Nama Kantor</Text>
              <Text>{this.state.data.nama_kantor}</Text>
            </View>
            <View style={{ marginBottom:10 }}>
              <Text style={{fontWeight: "bold"}}>Alamat</Text>
              <Text>{this.state.data.alamat}</Text>
            </View>
            <View style={{ marginBottom:10 }}>
              <Text style={{fontWeight: "bold"}}>Kota</Text>
              <Text>{this.state.data.nama_kota}</Text>
            </View>
            <View style={{ marginBottom:10 }}>
              <Text style={{fontWeight: "bold"}}>Kode Pos</Text>
              <Text>{this.state.data.kode_pos}</Text>
            </View>
            <View style={{ marginBottom:10 }}>
              <Text style={{fontWeight: "bold"}}>Tlp.</Text>
              <Text>{this.state.data.tlp}</Text>
            </View>
            <View style={{ marginBottom:10 }}>
              <Text style={{fontWeight: "bold"}}>Email</Text>
              <Text>{this.state.data.email}</Text>
            </View>
            <View style={{ marginBottom:10 }}>
              <Text style={{fontWeight: "bold"}}>Keterangan</Text>
              <Text>{this.state.data.ket}</Text>
            </View>
          </Card>

      </ScrollView>
    );
  }
}

export default Screen;
    