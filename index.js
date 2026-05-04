/**
 * @format
 */

import 'react-native-url-polyfill/auto';
import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';
import {backgroundMessageHandler} from '@/services';
import './src/language/i18n';

// Register background handler
messaging().setBackgroundMessageHandler(backgroundMessageHandler);

AppRegistry.registerComponent(appName, () => App);
