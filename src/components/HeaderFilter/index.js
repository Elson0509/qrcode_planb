import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native'

const HeaderFilter = props => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{props.title}</Text>
      <TouchableOpacity onPress={props.action}>
        <Text style={styles.headerFilter}>Filtrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },
  headerFilter: {
    color: '#004999',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default HeaderFilter;