import React from 'react';
import {SafeAreaView, Alert,
View, Text, TextInput, TouchableOpacity, AsyncStorage} from 'react-native';
import firebase from 'firebase';
import User from '../User';
import styles from '../constants/styles';

export default class ProfileScreen extends React.Component {

    static navigationOptions = {
        title: 'Profile'
    }

    state = {
        name: User.name
    }

    handleChange = key => value => {
        this.setState({
            [key]: value
        });
    }

    changeName = async () => {
        if(this.state.name.length < 3){
            Alert.alert('Error', 'Invalid Name');
        }
        if(User.name !== this.state.name){
            firebase.database().ref('users').child(User.phone).set({
                name: this.state.name
            })
            User.name = this.state.name;
            Alert.alert('Suceess', 'Name Changed');
        }
    }

     _logOut = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    }

    render(){
        return(
            <SafeAreaView style={styles.container}>
                <Text style={{fontSize:20}}> {User.phone} </Text>
                <Text style={{fontSize:20}}> {User.name} </Text>
                <TextInput
                    style={styles.input}
                    value={this.state.name}
                    onChangeText={this.handleChange('name')}
                />
                <TouchableOpacity onPress={this.changeName}>
                    <Text style={styles.btnText}>Change Name</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._logOut}>
                    <Text style={styles.btnText}>LogOut</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}