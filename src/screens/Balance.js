import React, {Component} from 'react';
import {StyleSheet,Text, View, Alert, ListView} from 'react-native';
import backend from '../server';

class Balance extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, data: {} };
  }

    static navigationOptions = {
      title: 'Balance',
    };

    componentDidMount(){
      this.onGetBalance()
        .then((tic) => tic.response.json() )
        
        // {

        //   this.setState({ data: tic });
        //   Alert.alert(JSON.stringify(this.state.data))
        //   // this.setState(previousState =>
        //   //   { loading: false }
        //   // )
        // }).catch((error) => {
        //   console.error(error);
        // });

    }

    onGetBalance(){
      let _ticker = backend.returnTicker('ETH_HOT');
      return _ticker;
    }

    render() {
      //const {navigate} = this.props.navigation;
  
      return (
         !this.state.loading &&
          <View>
          <Text style={styles.welcome}>{this.data}</Text>
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

  export default Balance;