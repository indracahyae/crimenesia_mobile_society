import React, { Component } from 'react';
import { View,Text, ToastAndroid,BackHandler,Dimensions,ScrollView,StyleSheet } from 'react-native';
import { Button,FormLabel,FormInput,Icon,Card,List,ListItem } from 'react-native-elements';
import axios from 'axios';
import { baseUrl } from '../helper/stuff';
import Modal from 'react-native-modal';

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
      data:'',
      listPelaku:[],
      modalPelaku: false
    };
    this.props.navigator.setOnNavigatorEvent(this.navBarEvent.bind(this));
  }

  componentDidMount(){
    this.getDetailKriminalitas(this.props.id_kriminalitas);
  }

  navBarEvent = (e) => {
    if (e.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (e.id == 'pelaku') { // this is the same id field from the static navigatorButtons definition
        this.listPelaku(this.props.id_kriminalitas);
        this.setState({ modalPelaku: true });
      }
    }
  };

  getDetailKriminalitas = (id) => {
    axios.get(baseUrl+'detailKriminalitasS/'+id)
    .then( (r) => {
      this.setState({ data: r.data });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  listPelaku = (id) => {
    axios.get(baseUrl+'listPelakuS/'+id)
    .then( (r) => {
      this.setState({ listPelaku: r.data });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    var d='';
    return (
      <ScrollView>
        <View 
          style={{backgroundColor: '#ecf0f1'}}
        >
          <Card
            title='Judul'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {this.state.data.judul}
            </Text>
          </Card>
          <Card
            title='Waktu'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
            {this.state.data.waktu}
            </Text>
          </Card>
          <Card
            title='Kota'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {this.state.data.nama_kota}
            </Text>
          </Card>
          <Card
            title='Alamat'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {this.state.data.alamat}
            </Text>
          </Card>
          <Card
            title='Tentang Pelaku'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {this.state.data.t_pelaku}
            </Text>
          </Card>
          <Card
            title='Tentang Korban'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {this.state.data.t_korban}
            </Text>
          </Card>
          <Card
            title='Deskripsi Kejadian'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {this.state.data.deskripsi_kejadian}
            </Text>
          </Card>
          <Card
            title='Kategori Kriminalitas'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {this.state.data.nama_kategori_kriminalitas}
            </Text>
          </Card>
          <Card
            title='Polisi'
            titleStyle={{
              textAlign: 'left'
            }}
          >
            <Text style={{marginBottom: 0}}>
              {this.state.data.nama_kantor}
            </Text>
          </Card>
        </View>
        <Modal isVisible={this.state.modalPelaku}>
          <View>
            <Icon
              raised
              name='close'
              color='#7f8c8d'
              size={17}
              onPress={() => this.setState({ modalPelaku: false })} 
            />
          </View>
          <ScrollView>
            <List>
              <ListItem
                key='x'
                title='Pelaku'
                rightIcon={{
                  name: 'keyboard-arrow-down'
                  }}
              />
              {this.state.listPelaku.map((d) => (
                <ListItem
                  hideChevron={true}
                  key={d.id_pelaku}
                  roundAvatar
                  avatar={{uri:baseUrl+'img/society/'+d.foto}}
                  title={d.nama_pelaku}
                  subtitle={
                    <View style={styles.subtitleView}>
                      <Text style={styles.ratingText}>{d.nik}</Text>
                    </View>
                  }
                />
              ))}    
            </List>
          </ScrollView>
        </Modal>
      </ScrollView>
    );
  }
}

export default Screen;

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
    