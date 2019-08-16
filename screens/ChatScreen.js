import React from 'react';
import {SafeAreaView,FlatList, Dimensions,KeyboardAvoidingView,
 View, Text, TextInput, TouchableOpacity} from 'react-native';
import styles from '../constants/styles';
import firebase from 'firebase';
import User from '../User';
import { GiftedChat } from 'react-native-gifted-chat'

export default class ChatScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        title: navigation.getParam('name', null);
    }

    constructor(props){
        super(props);
        this.state = {
            person: {
                name: props.navigation.getParam('name'),
                phone: props.navigation.getParam('phone')
            },
            textMessage: '',
            messageList: [],
            giftedMessages: [],
            otherMemberExpo: null,
        }
    }

    generateChat(messageList){
        const giftedMessages = [];
        for(let i=0; i < messageList.length; i++){
            giftedMessages.push({
                _id: messageList[i].time,
                text: messageList[i].message,
                createdAt: new Date(messageList[i].time),
                user: {
                    _id: messageList[i].from,
                    name: 'Hello world'
                },
            })
        }
        this.setState({giftedMessages});
    }

   
   componentWillMount() {
       let _this = this;
       firebase.database().ref('messages').child(User.phone).child(this.state.person.phone)
        .on('child_added', (value) => {
            this.setState((prevState) => {
                return{
                    messageList: [...prevState.messageList, value.val()]
                }
            }, () => this.generateChat(this.state.messageList));
        });


        let dBref = firebase.database().ref('/users/' + this.state.person.phone)
        dBref.on("value", function(snapshot) {
            const snap = snapshot.val();
            if(!!snap.expoToken){
                _this.setState({
                    otherMemberExpo: snap.expoToken
                });
            }
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
   }

   componentWillUnmount() {
    const x = firebase.database().ref('messages').child(User.phone).child(this.state.person.phone);
    x.off();
    };

   sendNotification(message, token){
        var messages = [];
        messages.push({
            'to': token,
            'body': message,
            'sound': 'default',
            'subtitle': `Message from ${User.name}`
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
   
    handleChange = key => val => {
        this.setState({ [key]: val });
    }

    convertTime = (time) => {
        let d = new Date(time);
        let c = new Date();
        let result = (d.getHours() < 10 ? '0': '') + d.getHours() + ':';
        result += (d.getMinutes() < 10 ? '0': '') + d.getMinutes();
        if(c.getDay() !== d.getDay()){
            result = d.getDay() + ' ' + d.getMonth() + ' ' + result;
        }
        return result;
    }

    sendMessage = async (messsages) => {
        if(messsages.length > 0){
            let msgId = firebase.database().ref('message').child(User.phone).child(this.state.person.phone).push().key;
            let updates = {};
            let message = {
                message: messsages[0].text,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: User.phone
            }
            updates[`messages/${User.phone}/${this.state.person.phone}/${msgId}`] = message;
            updates[`messages/${this.state.person.phone}/${User.phone}/${msgId}`] = message;
            firebase.database().ref().update(updates);

            if(this.state.otherMemberExpo !== null){
                this.sendNotification(messsages[0].text, this.state.otherMemberExpo);
            }
        }
    }

    renderRow = ({item}) => {
        return (
            <View style={{
                flexDirection: 'row',
                width:'60%',
                alignSelf: item.from === User.phone ? 'flex-end' : 'flex-start',
                backgroundColor: item.from === User.phone ? '#00897b' : '#7cb342',
                marginBottom: 10,
                borderRadius: 5
            }}>
                <Text style={{color: '#fff', padding:7, fontSize:16}}>
                    {item.message}
                </Text>
                <Text style={{color: '#eee', padding:3, fontSize:12}}>
                    {this.convertTime(item.time)}
                </Text>
            </View>
        )
    }
    render() {
        let {height, width} = Dimensions.get('window');
        return (
            <GiftedChat
                scrollToBottom
                inverted={false}
                onSend={messages => this.sendMessage(messages)}
                isAnimated
                messages={this.state.giftedMessages}
                user={{
                _id: User.phone,
                name: User.name
            }}
        />
        );
    }
}