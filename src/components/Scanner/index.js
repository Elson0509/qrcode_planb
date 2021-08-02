import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function Scanner(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    props.onCodeScanned( {type, data} )
    //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão para acessar câmera.</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sem permissão de acesso à câmera</Text>;
  }

  return (
    <View style={{
        flex: 1,

        //height: '100%',
        //width: '100%',
        //flexDirection: "column",
        //justifyContent: 'flex-end'
    }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Repetir escaneamento'} onPress={() => setScanned(false)} />}
    </View>
  );
}