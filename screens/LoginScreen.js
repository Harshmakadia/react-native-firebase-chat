import React from 'react';
import { StyleSheet, View, TextInput,Image,KeyboardAvoidingView, Dimensions,
TouchableOpacity, Alert, AsyncStorage} from 'react-native';
import User from '../User';
import styles from '../constants/styles';
import firebase from 'firebase';
import { Container, Header, Content, Text,Form, Item, Input, Label, Button } from 'native-base';

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
      Alert.alert('Error', 'Name must be Min 3 Chars')
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
    const {height: screenHeight} = Dimensions.get('window');
    return (
      <Container>
        <Content padder style={{marginLeft:10, marginRight:10}} scrollEnabled={false}>
          <View style={{flex: 1, height: screenHeight, justifyContent: 'center'}}>
            <Text style={{fontSize:20, marginBottom:10, alignSelf:'center'}}>Hello World 🤪</Text>
            <Image source={require('../images/party-popper.png')}
                style={{height:64, width:64, margin:5, alignSelf:'center'}}
            />
            <Form>
              <Item floatingLabel>
                <Label>Mobile No.</Label>
                <Input keyboardType = 'numeric' 
                  onChangeText={this.handleChange('phone')}
                  value ={this.state.phone}
                />
              </Item>
              <Item floatingLabel>
                <Label>Name</Label>
                <Input
                  value ={this.state.name}
                  onChangeText={this.handleChange('name')}
                />
              </Item>
              <Button block onPress={this.submitForm} style={{marginTop: 10}}>
                <Text>Login</Text>
              </Button>
            </Form>
          </View>
        </Content>
      </Container>
    );
  }
}