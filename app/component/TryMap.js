import React, { Component } from 'react';
import { View,Text, ToastAndroid,BackHandler,StyleSheet } from 'react-native';
import { Button,Icon } from 'react-native-elements';
import axios from 'axios';
import MapView from 'react-native-maps';

class Screen extends Component {

  constructor(props){
    super(props);
    this.state = {
      _token:'',
      regLat:-7.249731,
      regLong:112.752193
    };
  }

  render() {
    return (
    <View style ={styles.container}>
        <MapView
          region={{
            latitude: this.state.regLat,
            longitude: this.state.regLong,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider='google'
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          followsUserLocation={true}
        >

        </MapView>
        
        <View
          style={{
            alignItems: 'flex-end'
          }}
        >
          <Icon
            raised
            size={20}
            name='refresh'
            color='#7f8c8d'
          />
        </View>
      </View>
    );
  }
}

export default Screen;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

      justifyContent: 'flex-end',
      
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }
  });