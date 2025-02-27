import React from 'react';
import { AppLoading } from 'expo';
import { StyleSheet, StatusBar, Text, View } from 'react-native';
import {Roboto_400Regular, Roboto_500Medium} from '@expo-google-fonts/roboto'
import {Ubuntu_700Bold, useFonts} from '@expo-google-fonts/ubuntu'

import Routes from './src/routes';

export default function App() {

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  });

  if(!fontsLoaded) {
    return <AppLoading/>;
  }
  return (
    <>
    <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
    <Routes/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2bd96a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  title:{
    fontSize:26,
    fontWeight: '700',
    color: '#ececec'
  },
});
