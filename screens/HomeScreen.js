import React from 'react';
import {SafeAreaView,Alert, Image,View, Text, TouchableOpacity, AsyncStorage, FlatList} from 'react-native';
import User from '../User';
import styles from '../constants/styles';
import firebase from 'firebase';
import { Permissions, Notifications } from 'expo';

export default class HomeScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        return{
            title: 'Chats',
            headerRight: (
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Image source={require('../images/student.png')} style={{height:32,width:32,marginRight:7}} />
                </TouchableOpacity>
            )
        }
    }

    state = {
        users: [],
        isLoading: true
    }

    componentWillMount() {
        let dbRef = firebase.database().ref('users');
        dbRef.on('child_added', (val) => {
            let person = val.val();
            person.phone = val.key;

            //Don't show logged in user in list
            if(person.phone === User.phone){
                User.name = person.name
            }
            else{
                this.setState((prevState) => {
                    return {
                        users: [...prevState.users, person],
                        isLoading: false
                    }
                });
            }
           
        });
        this.registerForPushNotificationsAsync();
    }
    
    renderRow = ({item}) => {
        return(
            <TouchableOpacity 
                onPress={() => this.props.navigation.navigate('Chat', item)}
                style={{padding:10, borderBottomColor:'#ccc', borderBottomWidth:1}}>
                <Text style={{fontSize:20}}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    registerForPushNotificationsAsync = async (currentUser) => {
        const { existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;

        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        }

        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();

        // POST the token to our backend so we can use it to send pushes from there
        var updates = {}
        updates['/expoToken'] = token
        await firebase.database().ref('/users/' + User.phone).update(updates)
        //call the push notification 
    }

    sendNotification(){
        var messages = [];
        messages.push({
            'to': 'ExponentPushToken[Bid_HTE02jBz77aARfoI2R]',
            'body': 'hello test'
        })
        fetch('https://exp.host/--/api/v2/push/send', {
            'method': 'POST',
            'headers': {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messages)
        });
    }
    
    render(){
        return(
            <SafeAreaView>
            {this.state.isLoading ? <Text> Fetching chat....... </Text> :
                <FlatList
                    data={this.state.users}
                    renderItem={this.renderRow}
                    keyExtractor={(item) => item.phone}
                />
            }
            </SafeAreaView>
        )
    }
}