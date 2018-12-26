import React, { Component } from "react";
import { StyleSheet, Text, View, Button,Alert } from "react-native";
import {
  FormLabel,
  FormInput,
  FormValidationMessage
} from "react-native-elements";
import backend from "../server";
import keys from "../server/config";

import t from 'tcomb-form-native';

const Form = t.form.Form;

const User = t.struct({
  email: t.String,
  username: t.maybe(t.String),
  password: t.String,
  terms: t.Boolean
});

class CreateOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
          text: '',
          price: 0,
          token: ''
        };
    }
  static navigationOptions = {
    title: "CreateOrder"
  };

  componentDidMount() {
     // this._returnCurrency();
    }

  _returnCurrency(){
    backend.returnCurrency(key)
    .then(response => {
      this.setState({
        token: [response.address]
      });
    })
    .catch(error => {
      Alert.alert("Error", error)
    });
  }

  _createOrder(){
    const wall = keys.WALLET_ADDRESS;


    backend.order("buy", this.state.price, this.state.text, this.state.token, "")
      .then(response => {
        var obj = JSON.parse(response);
        Object.keys(obj).map(k => {
          if(Number(obj[k]) < 0.01) return
          this.setState({
            balances: [...this.state.balances, {key: k, value: Number(obj[k]).toFixed(2)}]
          });
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  }

  handleSubmit = () => {
    const value = this._form.getValue();
    console.log('value: ', value);
  }

  render() {
    /* 2. Get the param, provide a fallback value if not available */
    const { navigation } = this.props;
    const key = navigation.getParam('key', 'NO-ID');
    const value = navigation.getParam('value', 'some default value');

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
       <Form 
          ref={c => this._form = c}
          type={User} 
          options={options}
        />
        <Button
          title="Sign Up!"
          onPress={this.handleSubmit}
        />
      {/* <FormLabel><Text style={styles.welcome}>{key}</Text></FormLabel>
      <FormInput 
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({text})} 
          value={value}
          editable={true}
        /> */}

        {/* <Button
        title="Submit"
        onPress={() => this._createOrder()}
        /> */}
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
}

}
const formStyles = {
  ...Form.stylesheet,
  formGroup: {
    normal: {
      marginBottom: 10
    },
  },
  controlLabel: {
    normal: {
      color: 'blue',
      fontSize: 18,
      marginBottom: 7,
      fontWeight: '600'
    },
    // the style applied when a validation error occours
    error: {
      color: 'red',
      fontSize: 18,
      marginBottom: 7,
      fontWeight: '600'
    }
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
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

export default CreateOrder;
