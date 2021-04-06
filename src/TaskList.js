import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';


export default function TaskList({ data,deleteItem, itemEdit }) {
 return (
   <View style={styles.container}> 
      <TouchableOpacity style={{width: 50}} >
        <FontAwesome.Button name="trash" color="#fff" backgroundColor="#121212"
           onPress={()=>{deleteItem(data.key)}}
        >
        </FontAwesome.Button>
      </TouchableOpacity>

      <View>
        <TouchableWithoutFeedback onPress={()=>itemEdit(data)}>
          <Text style={{color:'#fff',paddingRight: 10}}>{ data.nome }</Text>
        </TouchableWithoutFeedback>
      </View>
   </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#121212',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
    padding: 10
  }
})