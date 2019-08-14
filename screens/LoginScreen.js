import React from 'react';
import { StyleSheet, Text, View, TextInput,Image,KeyboardAvoidingView,
TouchableOpacity, Alert, AsyncStorage
} from 'react-native';
import User from '../User';
import styles from '../constants/styles';
import firebase from 'firebase';
import {Toast} from 'native-base';

export default class LoginScreen extends React.Component {

  static navigationOptions = {
      header: null
  }  

  state = {
    phone: '',
    name: '',
  }

  handleChange = key => val => {
    this.setState({ [key]: val})
  }

  submitForm = async () => {
    if(this.state.phone.length < 10){
       Alert.alert('Error', 'Wrong phone number')
    }
    else if(this.state.name.length < 3){
      Alert.alert('Error', 'Wrong name')
    }
    else{
      // save user data here
      await AsyncStorage.setItem('userPhone', this.state.phone);
      User.phone = this.state.phone;
      firebase.database().ref('users/' + User.phone).set({
          name: this.state.name
      });
      this.props.navigation.navigate('App');
    }
  }

  render() {
    return (
    <KeyboardAvoidingView behavior="padding" enabled style={{flex: 1}}>
        <View style={styles.container}>
            <Text style={{fontSize:20}}>Hello World 🤪</Text>
            <Image source={require('../images/party-popper.png')}
                style={{height:64, width:64, margin:5}}
            />
            <TextInput
            value ={this.state.phone}
            placeholder="Phone Number"
            style={styles.input}
            onChangeText={this.handleChange('phone')}
            />
            <TextInput
            value ={this.state.name}
            placeholder="Name"
            style={styles.input}
            onChangeText={this.handleChange('name')}
            />
            <TouchableOpacity onPress={this.submitForm}>
            <Text style={styles.btnText}>Enter</Text>
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}