import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import firebase from './src/firebaseConnection';
import { FontAwesome } from '@expo/vector-icons';

import TaskList from './src/TaskList';

export default function App() {
  const [task,setTask] = useState('');
  const [tasks,setTasks] = useState([]);
  const inputRef = useRef(null);

  const [key,setKey] = useState('');

  useEffect( () =>{
    async function loadTask(){
      await firebase.database().ref('tarefas').on('value', (snapshot)=>{
        setTasks([]);
        snapshot.forEach( (itemChild) => {
          let data = {
            key: itemChild.key,
            nome: itemChild.val().nome
          }
          setTasks( oldArray => [...oldArray, data]);
        } )
      })
    }
    loadTask();
  }, []);

  async function handleAdd() {
    if(task !== ''){
      if(key !== ''){
        await firebase.database().ref('tarefas').child(key).update({
          nome: task
        });
        Keyboard.dismiss();
        setTask('');
        setKey('');
        return;
      }
      let tarefas = await firebase.database().ref('tarefas');
      let chave = tarefas.push().key;
      tarefas.child(chave).set({
        nome: task
      });
      Keyboard.dismiss();
      setTask('');
    }

    
  }
  async function handleDelete(key) {
    await firebase.database().ref('tarefas').child(key).remove();
  }
  function handleEdit(data){
    setTask(data.nome);
    setKey(data.key);
    inputRef.current.focus();
  }
  function cancelEdit(){
    setKey('');
    setTask('');
    Keyboard.dismiss();
  }
 return (
   <View style={styles.container}>
    {key.length > 0 && (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={{width: 50,}} >
          <FontAwesome.Button onPress={cancelEdit} name="times-circle" color="#ff0000" backgroundColor="#fff"
          />
        </TouchableOpacity>
       <Text style={{ marginLeft:5,marginTop:7,color:'#ff0000' }}>
        Você está editando uma tarefa
       </Text>
     </View>
    )}
     

    <View style={styles.containerTask}>
      <TextInput 
        style={styles.input}
        placeholder="O que vai fazer hoje?"
        underlineColorAndroid="transparent"
        onChangeText={ (value) => setTask(value)}
        value={ task }
        ref={inputRef}
      />

      <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd} >
        <Text style={ styles.buttonText } > + </Text>
      </TouchableOpacity>
    </View>

    <FlatList 
      keyExtractor={item => item.key }
      data={tasks}
      renderItem={ ( { item } ) => (
        <TaskList data={ item } deleteItem={handleDelete} itemEdit={handleEdit} />
      ) }
    />
   </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    marginTop: 50,
    marginLeft: 10,
    marginRight: 10
  },
  containerTask: {
    flexDirection: 'row'
  },
  input: {
    flex:1,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#121212',
    height: 40,
    fontSize: 17
  },
  buttonAdd:{
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    backgroundColor: '#121212',
    color: '#fff',
    paddingLeft: 14,
    paddingRight: 14,
    marginLeft: 4
  },
  buttonText: {
    fontSize: 20,
    color: '#fff'
  }
})