import Ionicons from 'react-native-vector-icons/Ionicons';
import Evilicons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const icons = {
  "refresh": [MaterialIcons, 'refresh', 23, '#FFFFFF'],
  "directions": [MaterialIcons, 'directions', 23, '#FFFFFF'],
  "pathRoute": [MaterialIcons, 'near-me', 23, '#FFFFFF'],
  "myLocation": [MaterialIcons, 'my-location', 23, '#FFFFFF'],
  "logOut": [MaterialIcons, 'lock-outline', 23, '#FFFFFF'],
  "edit": [MaterialIcons, 'mode-edit', 23, '#FFFFFF'],
  "done": [MaterialIcons, 'done', 23, '#FFFFFF'],
  "bukti": [MaterialIcons, 'insert-drive-file', 23, '#FFFFFF'],
  "pelapor": [MaterialIcons, 'face', 23, '#FFFFFF'],
  "pelaku": [MaterialIcons, 'adb', 23, '#FFFFFF'],
  "markerCrime": [MaterialIcons, 'bug-report', 20, '#e74c3c'],
  "markerPoliceOffice": [MaterialIcons, 'star', 20, '#8e44ad'],
  "add": [MaterialIcons, 'add', 23, '#f39c12'],
  "image": [MaterialIcons, 'image', 23, '#f39c12'],
  "pesan": [MaterialIcons, 'email', 23, '#f39c12'],
  "map": [MaterialIcons, 'map', 23, '#f39c12'],
  "myProfile": [MaterialIcons, 'account-circle', 23, '#f39c12'],
  "polygonLayer": [MaterialIcons, 'layers', 23, '#f39c12'],
  "redMarker": [MaterialIcons, 'place', 23, '#F44336'],
};

let IconsMap = {};
let IconsLoaded = new Promise((resolve, reject) => {
  new Promise.all(
    Object.keys(icons).map(iconName =>
      icons[iconName][0].getImageSource(
        icons[iconName][1],
        icons[iconName][2],
        icons[iconName][3]
      ))
  ).then(sources => {
    Object.keys(icons)
      .forEach((iconName, idx) => IconsMap[iconName] = sources[idx]);
    resolve(true);
  })
});

export {
  IconsMap,
  IconsLoaded
};