import  React from 'react';
import {StyleSheet} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container1: {
    flex: 1,
    backgroundColor: '#f5fcff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:"row"
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    width: '80%',
    marginBottom: 1,
    borderRadius: 5
  },
  btnText: {
    color: 'darkblue',
    fontSize: 20
  }
});

export default styles;