import { Navigation } from 'react-native-navigation';

import LoginScreen from './component/LoginScreen';
import SignUp from './component/SignUp';
import MyProfil from './component/MyProfil';
import Lapor from './component/Lapor';
import AddLapor from './component/AddLapor';
import DetailLapor from './component/DetailLapor';
import EditLapor from './component/EditLapor';
import BuktiLapor from './component/BuktiLapor';
import Pemetaan from './component/Pemetaan';
import ListKriminalitas from './component/ListKriminalitas';
import DetailMarker from './component/DetailMarker';
import DetailMarkerKantorPolisi from './component/DetailMarkerKantorPolisi';
import EditMyProfil from './component/EditMyProfil';
import { singleScreen } from './helper/stuff';

export default () => {

	Navigation.registerComponent('LoginScreen', () => LoginScreen);
	Navigation.registerComponent('SignUp', () => SignUp);
	Navigation.registerComponent('Pemetaan', () => Pemetaan);
	Navigation.registerComponent('ListKriminalitas', () => ListKriminalitas);
	Navigation.registerComponent('DetailMarker', () => DetailMarker);
	Navigation.registerComponent('Lapor', () => Lapor);
	Navigation.registerComponent('AddLapor', () => AddLapor);
	Navigation.registerComponent('DetailLapor', () => DetailLapor);
	Navigation.registerComponent('DetailMarkerKantorPolisi', () => DetailMarkerKantorPolisi);
	Navigation.registerComponent('EditLapor', () => EditLapor);
	Navigation.registerComponent('BuktiLapor', () => BuktiLapor);
	Navigation.registerComponent('MyProfil', () => MyProfil);
	Navigation.registerComponent('EditMyProfil', () => EditMyProfil);

  	singleScreen();

	// ignore cause of firebase
	console.ignoredYellowBox = ['Setting a timer'];
};