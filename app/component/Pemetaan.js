import React, { Component } from 'react';
import { View,Text, ToastAndroid,BackHandler,Dimensions,StyleSheet,Linking,ActivityIndicator,Modal } from 'react-native';
import { Button,FormLabel,FormInput,Icon,Card } from 'react-native-elements';
import MapView from 'react-native-maps';
import axios from 'axios';
import { baseUrl,standartDeviasi } from '../helper/stuff';
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
      regLat:-7.249731,
      regLong:112.752193,
      currentLat:'',
      currentLong:'',
      destLat:'',
      destLong:'',
      coords:'',
      refreshIndicator:false,
      currentLocation:[],
      listKriminalitas:[],
      listKantorPolisi:[],
      listPolygon:[],
      standartDeviasi:'',
      avg:'',
      polygon:0,
      modalVisible:false,
      region: {
        latitude: -7.249731,
        longitude: 112.752193,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    };
    this.props.navigator.setOnNavigatorEvent(this.navBarEvent.bind(this));
    IconsLoaded;
  }

  componentDidMount(){
    this.setState({refreshIndicator: true});
    this.getListKriminalitas();
    this.getListKantorPolisi();
  }

  navBarEvent = (e) => {
    if (e.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (e.id == 'myPosition') { // this is the same id field from the static navigatorButtons definition
        this.posisiSaya();
      } else if (e.id == 'rute') {
        this.getRute();
      } else if (e.id == 'direction'){
        this.getDirection();
      } else if (e.id == 'polygonLayer'){
        this.getListPolygon();
      } else if (e.id == 'aboutPolygon'){
        this.setState({modalVisible:true});
      }
    }
  };

  getRute = () => {
    const mode = 'driving'; // 'walking';
    const origin = this.state.currentLat+','+this.state.currentLong;
    const destination = this.state.destLat+','+this.state.destLong;
    const APIKEY = 'AIzaSyAnbCW_HlsNVGl0ibAVAG-3G6YpzI9UyU8';
    // const url = "https://maps.googleapis.com/maps/api/directions/json?origin=-7.355003,%20112.720952&destination=-7.350832,%20112.718796&key=AIzaSyAnbCW_HlsNVGl0ibAVAG-3G6YpzI9UyU8&mode=driving";
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${APIKEY}&mode=${mode}`;

    axios.get(url)
    .then( (r) => {
      console.log(r);
      if (r.data.routes.length) {
        this.setState({
            coords: this.decode(r.data.routes[0].overview_polyline.points) // definition below
        });
      }

    })
    .catch(function (error) {
      console.log(error);
    });
  }

  // draw rute
  decode = (t,e) => {for(var n,o,u=0,l=0,r=0,d= [],h=0,i=0,a=null,c=Math.pow(10,e||5);u<t.length;){a=null,h=0,i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);n=1&i?~(i>>1):i>>1,h=i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);o=1&i?~(i>>1):i>>1,l+=n,r+=o,d.push([l/c,r/c])}return d=d.map(function(t){return{latitude:t[0],longitude:t[1]}})}

  getListKriminalitas = () => {
    axios.get(baseUrl+'listKriminalitasS')
    .then( (r) => {
      this.setState({listKriminalitas: []});
      this.setState({
        listKriminalitas: r.data,
        refreshIndicator: false
      });
      console.log(r);
    })
    .catch( (error)=>{
      console.log(error);
    });
  }

  getListKantorPolisi = () => {
    axios.get(baseUrl+'listPemetaanKantorPolisiS')
    .then( (r) => {
      this.setState({listKantorPolisi: []});
      this.setState({
        listKantorPolisi: r.data,
        refreshIndicator: false
      });
      console.log(r);
    })
    .catch( (error) => {
      console.log(error);
    });
  }

  // posisi saya
  posisiSaya = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
            
          var lat = position.coords.latitude;
          var long = position.coords.longitude;
          this.setState({currentLocation: []});
          this.state.currentLocation.push(
            <MapView.Marker
              key={0}
              coordinate={{latitude: lat,longitude: long,}}
              title='posisi saya'   
              pinColor='blue'
              onPress={() => {
                this.setState({
                  regLat: lat, 
                  regLong:long
                });
              }}     
            />
          );
          this.setState({
              currentLocation: this.state.currentLocation,
          });

          this.setState({
            regLat: lat, 
            regLong:long,
            currentLat:lat,
            currentLong:long
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

  getCoordinate = (lat,long) => {
      var r = {
                latitude: lat,
                longitude: long };
    return r;
  }

  setDestination = (destLat, destLong) => {
    this.setState({
      destLat: destLat,
      destLong: destLong,
      regLat: destLat,
      regLong: destLong,
      coords:''
    });
  }

  getDirection = () => {
    var url = 'google.navigation:q='+this.state.destLat+','+this.state.destLong; //-7.298471, 112.766914' UNTAG
    Linking.canOpenURL(url)
      .then(
        supported => {
          if(supported){
            Linking.openURL(url);
          }else{
            console.log('ga bisa buka');
          }
        }
      );
  }

  detailKantorPolisi = (d) =>{
    this.props.navigator.showModal({
      screen: 'DetailMarkerKantorPolisi',
      title: 'Detail Kantor Polisi',
      passProps: {
        data: d
      }
    });
  }

  listKriminalitas = (kKota,kAlamat) =>{
    this.props.navigator.push({
      screen: 'ListKriminalitas',
      title: 'Kriminalitas',
      passProps: {
        kKota: kKota,
        kAlamat: kAlamat
      }
    });
  }

  getListPolygon = () =>{
    if(this.state.polygon == 0){ // show polygon
      ToastAndroid.show('show polygon', ToastAndroid.SHORT)
      axios.get(baseUrl+'polygonS')
      .then( (r) => {
        var polygon = standartDeviasi(r.data,Object.keys(r.data).length);
        this.setState({listPolygon: []});
        this.setState({
          listPolygon: r.data,
          standartDeviasi: polygon.sd,
          avg: polygon.avg,
          refreshIndicator: false
        });      
        console.log("standart deviasi = " + polygon.sd);
        this.setState({polygon:1});
      })
      .catch( (error) => {
        console.log(error);
      });
    }else if (this.state.polygon == 1){ // hide polygon
      this.setState({polygon:0, listPolygon:[]});
      ToastAndroid.show('hide polygon', ToastAndroid.SHORT)
    }
  }

  polygonColor = (sd,avg,jml_crime) =>{  // blue, green, orange, red      
    if(jml_crime >= avg+sd+sd){
      // rawan (red)
      return "rgba(255,0,0,0.4)";
    }else if(jml_crime >= avg+sd){
      // waspada (orage)
      return "rgba(255,140,0,0.4)";
    } else if(jml_crime >= avg){
      // normal (green)
      return "rgba(0,255,0,0.2)";
    } else if(jml_crime < avg){
      // safe (blue)
      return "rgba(0,0,255,0.2)";
    }
  }

  // fungsi - nama Poligon
  polygonName = (str)=>{
    str = str.replace("Polsek", "");
    return str;
  }

  render() {
    return (
      <View style ={styles.container}>
        <MapView
          region={this.state.region}
          onRegionChange={(e) => {this.setState({region:e.nativeEvent})}}
          provider='google'
          style={styles.map}
          showsUserLocation={true}
          showsCompass={true}
          followsUserLocation={true}
        >

          {this.state.currentLocation}
          
          {this.state.listKriminalitas.map((d) => (
            <MapView.Marker
              image={IconsMap['markerCrime']}
              key={d.lat}
              coordinate={this.getCoordinate(d.lat,d.long)}
              title={d.alamat}
              description={d.nama_kota}
              onPress={() => this.setDestination(d.lat,d.long)}
              onCalloutPress={() => this.listKriminalitas(d.id_kota, d.alamat)}
            />
          ))}
          
          {this.state.listKantorPolisi.map((d) => (
            <MapView.Marker
              image={IconsMap['markerPoliceOffice']}
              key={d.idKantorPolisi}
              coordinate={this.getCoordinate(d.lat,d.long)}
              title={d.nama_kantor}
              description={d.alamat+', '+d.nama_kota}
              onPress={() => this.setDestination(d.lat,d.long)}
              onCalloutPress={()=>this.detailKantorPolisi(d)}
            />
          ))} 

          <MapView.Polyline
            coordinates={[
                ...this.state.coords,
            ]}
            strokeWidth={4}
          />

          {this.state.listPolygon.map((d) => (
            <MapView.Polygon
              key={d.id_kantor_polisi}
              coordinates={eval('(' + d.path + ')')}
              strokeColor="rgba(255,0,0,0.7)"
              fillColor={this.polygonColor(this.state.standartDeviasi,this.state.avg,d.jumlah_crime)}
              strokeWidth={1}
              onPress={() => ToastAndroid.show(this.polygonName(d.nama_kantor), ToastAndroid.SHORT) }
            />
          ))} 

        </MapView>
        <ActivityIndicator
          animating={this.state.refreshIndicator}
          size="large"
        />
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
            onPress={() => {this.getListKriminalitas(); this.getListKantorPolisi();this.setState({refreshIndicator: true,coords:[],currentLocation:[]});}}
          />
        </View>

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
              iconStyle={{alignSelf:'flex-start'}}
              onPress={() => this.setState({ modalVisible: false })} />
            <Card
              title='Tingkat Kriminalitas'
              titleStyle={{
                textAlign: 'left'
              }}
            >
              <Text >
                Merah = Ekstrim
              </Text>
              <Text >
                Oranye = Tinggi
              </Text>
              <Text >
                Hijau = Sedang
              </Text>
              <Text style={{marginBottom: 0}}>
                Ungu = Rendah
              </Text>
            </Card>
          </View>
        </Modal>

      </View>
    );
  }
}

export default Screen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
