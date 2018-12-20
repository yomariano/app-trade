import React, {Component} from 'react';
import {StyleSheet,Text, View} from 'react-native';

class Trades extends Component {
    static navigationOptions = {
      title: 'Trades',
    };
    render() {
      //const {navigate} = this.props.navigation;
      return (
        <View>
         <Text style={styles.welcome}>Trades</Text>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
  });

  export default Trades;