import React, { Component } from 'react';
import { View,Text, ToastAndroid,BackHandler,Dimensions,ScrollView,StyleSheet } from 'react-native';
import { Button,FormLabel,FormInput,Icon,Card,List,ListItem } from 'react-native-elements';
import axios from 'axios';
import { baseUrl } from '../helper/stuff';
import Modal from 'react-native-modal';
import {IconsMap, IconsLoaded} from '../helper/appIcon';
import Snackbar from 'react-native-snackbar';

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
    navBarBackgroundColor: '#1abc9c'    
  };

  constructor(props){
    super(props);
    this.state = {
      _token:'',
      listCrime:[]
    
    };
    this.props.navigator.setOnNavigatorEvent(this.navBarEvent.bind(this));
    IconsLoaded;
  }

  componentDidMount() {
    this.getListCrime(this.props.kKota,this.props.kAlamat);
  }

  getListCrime = (kKota,kAlamat) => {
    axios.get(baseUrl+'detailListKriminalitasS/'+kKota+'/'+kAlamat)
    .then( (r) => {
    //   console.log(r.data);
      this.setState({listCrime: []});
      this.setState({
        listCrime: r.data,
      });
    })
    .catch( (error) => {
      console.log(error);
    });
  }

  navBarEvent = (e) => {
    if (e.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (e.id == '') { // this is the same id field from the static navigatorButtons definition
        
      }
    }
  };

  detailCrime = (id_kriminalitas) => {
    this.props.navigator.showModal({
      screen: 'DetailMarker',
      title: 'Detail Kriminalitas',
      passProps: {
        id_kriminalitas: id_kriminalitas
      },
      navigatorButtons: {
        rightButtons: [
          {
            icon: IconsMap['pelaku'], // for icon button, provide the local image asset name
            buttonColor: '#2c3e50',
            id: 'pelaku' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
          }
        ]
      }
    });
  };

  waktuCrime = (d) => {
    Snackbar.show({
        title: d,
        duration: Snackbar.LENGTH_SHORT,
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
                {this.state.listCrime.map((d) => (
                <ListItem
                    key={d.id_kriminalitas}
                    title={d.nama_kategori_kriminalitas}
                    rightIcon={{
                        name: 'access-time'
                    }}
                    subtitle={
                    <View style={styles.subtitleView}>
                        <Text style={styles.ratingText}>{d.judul}</Text>
                    </View>
                    }
                    onPress={() => this.detailCrime(d.id_kriminalitas)}
                    onPressRightIcon={() => this.waktuCrime(d.waktu_kriminalitas)}
                />
                ))}
            </List>          
      </ScrollView>
    );
  }
}

export default Screen;
    