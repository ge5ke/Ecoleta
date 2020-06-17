import React from 'react';
import { StyleSheet, Image, ImageBackground, Text, View, Picker, Alert } from 'react-native';
import { RectButton, TextInput } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import axios from 'axios';


interface IBGEUFResponse {
  sigla: string;
};

interface IBGECityResponse {
  nome: string;
};



const Home = () => {

    const [ufs, setUfs] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState<string>('0');
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('0');

    const navigation = useNavigation();

    const alertNoPlace = () =>
    Alert.alert(
      "Escolha um lugar!",
      "É necessário escolher um lugar para continuar.",
      [
        { text: "Entendi", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );

    function handleNavigateToPoints( city: string, uf:string) {

      if (city === '0' || uf === '0'){
        return alertNoPlace();
      }
      navigation.navigate('Points', {city: city, uf:uf});
    }

    useEffect(() => {
      axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {

          const ufInitials = response.data.map(uf => uf.sigla);  
          setUfs(ufInitials);      
      })
    }, []);

    useEffect(() => {
      if (selectedUf=== '0'){
          return;
      }
      
      axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
          const CityNames = response.data.map(city => city.nome);  
          setCities(CityNames);  

      })
    }, [selectedUf]);


    return (
        <ImageBackground 
            style={styles.container} 
            source={require('../../assets/home-background.png')}
            imageStyle={{width:274, height:368}}
        >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')}/>
                <Text style={styles.title}>Seu Marketplace de coleta de resíduos.</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrar pontos de coleta de forma eficiente.</Text>
            </View>
            
            <View style={styles.footer}>
              <Picker
                selectedValue={selectedUf}
                style={styles.select}
                onValueChange={(value) => setSelectedUf(value)}
              >
                <Picker.Item label="Selecione uma UF" value="0" />
                
                {ufs.map(uf => (
                  <Picker.Item label={uf} value={uf} key={uf} />
                ))}
              </Picker>

              <Picker
                selectedValue={selectedCity}
                style={styles.select}
                onValueChange={(value) => setSelectedCity(value)}
              >
                <Picker.Item label="Selecione uma Cidade" value="0" />
                
                {cities.map(city => (
                  <Picker.Item label={city} value={city} key={city} />
                ))}
              </Picker>
              <RectButton style={styles.button} onPress={() => handleNavigateToPoints(selectedCity, selectedUf)}> 
                <View style={styles.buttonIcon}>
                  <Text>
                    <Icon name="arrow-right" color="#FFF" size={24}></Icon>
                  </Text>
                </View>
                <Text style={styles.buttonText}>
                        Entrar
                </Text>
              </RectButton>
            </View>

        </ImageBackground>
    )

};

export default Home;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {   
      height: 60,
      backgroundColor: 'rgba(255,255,255, 0.5)',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });