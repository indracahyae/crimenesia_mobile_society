import { Navigation } from 'react-native-navigation';
import {IconsMap, IconsLoaded} from '../helper/appIcon';

export var baseUrl= 'http://192.168.1.88/crimenesia/public/';

export function tabScreen(nik){
    IconsLoaded.then(() => { 
        Navigation.startTabBasedApp({
            tabs: [
                {
                    screen: 'Lapor',
                    icon: IconsMap['pesan'],
                    title: 'Data Lapor',
                    navigatorButtons: {
                        rightButtons: [
                            {
                                icon: IconsMap['refresh'], // for icon button, provide the local image asset name
                                buttonColor: '#2c3e50',
                                id: 'reload' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                            },
                            {
                                icon: IconsMap['add'], // for icon button, provide the local image asset name
                                buttonColor: '#2c3e50',
                                id: 'add' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                            }
                        ]
                    }
                },
                {
                    screen: 'Pemetaan',
                    icon: IconsMap['map'],
                    title: 'Crime Map',
                    navigatorButtons: {
                        rightButtons: [
                            {
                                title: 'About Polygon',
                                id: 'aboutPolygon' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                            },
                            {
                                title: 'My Position',
                                // icon: IconsMap['myLocation'], // for icon button, provide the local image asset name
                                buttonColor: '#2c3e50',
                                id: 'myPosition' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                            },
                            {
                                title: 'Draw Rute',
                                // icon: IconsMap['pathRoute'], // for icon button, provide the local image asset name
                                buttonColor: '#2c3e50',
                                id: 'rute' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                            },
                            {
                                icon: IconsMap['directions'], // for icon button, provide the local image asset name
                                buttonColor: '#2c3e50',
                                id: 'direction' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                            },
                            {
                                icon: IconsMap['polygonLayer'], // for icon button, provide the local image asset name
                                buttonColor: '#2c3e50',
                                id: 'polygonLayer' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                            }
                        ]
                    }
                },
                {
                    screen: 'MyProfil',
                    icon: IconsMap['myProfile'],
                    title: 'My Profile',
                    navigatorButtons: {
                        rightButtons: [
                            {
                                icon: IconsMap['logOut'], // for icon button, provide the local image asset name
                                buttonColor: '#2c3e50',
                                id: 'logout' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                            },
                            {
                                icon: IconsMap['edit'], // for icon button, provide the local image asset name
                                    buttonColor: '#2c3e50',
                                id: 'edit' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                            },
                            {
                                icon: IconsMap['image'], // for icon button, provide the local image asset name
                                    buttonColor: '#2c3e50',
                                id: 'editFoto' // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                            }
                        ]
                    }
                }  
            ],
            appStyle: {
                tabBarSelectedButtonColor: '#2c3e50',
                tabBarButtonColor: '#ecf0f1',
                tabBarBackgroundColor: '#1abc9c',
                tabBarHideShadow: false
            },
            passProps: {
                userNik: nik
            }
        });
    });
}

export function singleScreen() {
    Navigation.startSingleScreenApp({
        screen: {
          screen: 'LoginScreen', // unique ID registered with Navigation.registerScreen
          title: 'Login', // title of the screen as appears in the nav bar (optional)
          navigatorStyle: {
              navBarHidden: true // make the nav bar hidden
          }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
          navigatorButtons: {} // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
        },
        passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
        animationType: 'slide-down' // optional, add transition animation to root change: 'none', 'slide-down', 'fade'
    });
}

export function fKelamin(d) {
	switch(d){
        case 1:
            return "Laki-laki";
            break;
        case 2:
            return "Perempuan";
            break;
    }
}

export function fAgama(d) {
	switch(d){
        case 0:
            return "Islam";
            break;
        case 1:
            return "Kristen";
            break;
        case 2:
            return "Hindu";
            break;
        case 3:
            return "Buddha";
            break;
        case 4:
            return "Konghucu";
            break;
    }
}

export function fValidasiLapor(d) {
    switch(d){
        case 0:
            return "Tidak Valid";
            break;
        case 1:
            return "Valid";
            break;
        case 2:
            return "Dalam Pemeriksaan";
            break;
        case 3:
            return "Belum Diperiksa";
            break;
    }
}

export function standartDeviasi(data,jml_data){
    var total,total2,avg,varian,sd;
    total = 0; total2=0;
	  	
  	for ( var key in data)
	{
	    total=total+data[key].jumlah_crime;
	    total2=total2+data[key].jumlah_crime*data[key].jumlah_crime;
	}
//	hitung avg
	avg = total/jml_data;
	
//	varian
	varian = ((jml_data*total2)-(total*total)) / (jml_data*(jml_data-1));
	
//	SD
    sd=Math.sqrt(varian);
    
    var obj = {
        avg: avg,
        sd: sd
    }

    return obj;
}