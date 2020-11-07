
import React from 'react';
import Navigation from './app/navigations/Navigation';
import { firebaseApp } from './app/utils/firebase';
import {decode, encode} from 'base-64'
// @TODO: This is to hide a Warning caused by NativeBase after upgrading to RN 0.62
import { LogBox } from 'react-native'

LogBox.ignoreLogs([
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
  'Setting a timer'
])
// ------- END OF WARNING SUPPRESSION

if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

export default function App() {
  return <Navigation />
}
