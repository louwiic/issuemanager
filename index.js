/**
 * @format
 */

import {AppRegistry} from 'react-native';
import 'react-native-gesture-handler';

import App from './App';
import 'moment/locale/fr';
import 'moment/locale/de';
import 'moment/locale/it';
import 'moment/locale/pt';
import 'moment/locale/es';
import moment from 'moment';
moment.locale('fr');

import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
