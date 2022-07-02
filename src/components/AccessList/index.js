import React from 'react';
import {
  FlatList,
} from 'react-native';
import AccessItem from './AccessItem';

const AccessList = (props) => {
  return (
    <FlatList
      data={props.accesses}
      keyExtractor={(item) => item.id}
      onEndReached={()=>props.endReachedHandler()}
      renderItem={(obj) => {
        return <AccessItem key={obj.item.id} access={obj.item} index={obj.index+1} />
      }}
    />
  );
};

export default AccessList;