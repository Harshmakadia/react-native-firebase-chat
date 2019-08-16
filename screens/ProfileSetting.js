import React from 'react';
import {SafeAreaView, Alert,
View, TextInput, TouchableOpacity, AsyncStorage, Dimensions} from 'react-native';
import firebase from 'firebase';
import User from '../User';
import styles from '../constants/styles';
import { Container, Header, Content, Button, Text } from 'native-base';

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
        const {height: screenHeight} = Dimensions.get('window');
        return(
            <Container>
                <Content padder style={{marginLeft:10, marginRight:10}} scrollEnabled={false}>
                    <View style={{flex: 1,height: screenHeight,justifyContent: 'center'}}>
                        <Text style={{fontSize:20}}> {User.phone} </Text>
                        <Text style={{fontSize:20}}> {User.name} </Text>
                        <TextInput
                            style={styles.input}
                            value={this.state.name}
                            onChangeText={this.handleChange('name')}
                        />
                        <Button success onPress={this.changeName} style={{marginTop: 10}}>
                            <Text> Change Name </Text>
                        </Button>
                        <Button danger onPress={this._logOut} style={{marginTop: 10}}>
                            <Text> LogOut </Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        )
    }
}