import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default Scanner = props =>{
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    //setScanned(true);
    props.onCodeScanned( type, data )
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
    }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        //style={StyleSheet.absoluteFillObject}
        style={{height: 500, width: 360, marginTop: 100}}
      />
      {scanned && <Button title={'Repetir escaneamento'} onPress={() => setScanned(false)} />}
    </View>
  );
}