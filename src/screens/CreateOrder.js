import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  CheckBox,
  Select,
  View,
  Button,
  Alert,
  Input
  
} from "react-native";

import TextInput from 'react-native-material-textinput'

import {
  FormLabel,
  FormInput,
  FormValidationMessage
} from "react-native-elements";
import backend from "../server";
import keys from "../server/config";

class CreateOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: "",
      price: '0',
      token: ""
    };
  }
  static navigationOptions = {
    title: "CreateOrder"
  };

  componentDidMount() {
    // this._returnCurrency();
  }

  _returnCurrency() {
    backend
      .returnCurrency(key)
      .then(response => {
        this.setState({
          token: [response.address]
        });
      })
      .catch(error => {
        Alert.alert("Error", error);
      });
  }

  onCreateOrder(action, token, price, quantity){

    console.log("action => ", action)
    console.log("token => ", token)
    console.log("price => ", price)
    console.log("quantity => ", quantity)
    backend
      .orderAPI(action, token, price, quantity)
      .then(response => {
        //this.props.navigation.navigate('OpenOrders');
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });

  }

  handleSubmit = () => {
    const value = this._form.getValue();
    console.log("value: ", value);
  };

  render() {
    /* 2. Get the param, provide a fallback value if not available */
    const { navigation } = this.props;
    this.state.token = navigation.getParam("key", "NO-ID");
    let value = navigation.getParam("value", "some default value");

    return (
      <View style={{flex: 1,flexDirection: 'column',justifyContent: 'center',alignItems: 'stretch'}}>

<Text style={styles.welcome}>{this.state.quantity}</Text>

    <TextInput
        label={this.state.token}
        value= {this.state.quantity}
        keyboardType="decimal-pad"

        onChangeText={quantity => this.setState({ quantity })}
      />

    <TextInput
        label="Price"
        style={styles.textInput}
        keyboardType="decimal-pad"
        value={this.state.price}
        maxLength={10} 
        inlineImageLeft='search_icon'
        onChangeText={price => this.setState({ price })}
      />

    <Button
        title="Submit"
        onPress={() => this.onCreateOrder("sell", this.state.token, this.state.price, this.state.quantity)}
    />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});

export default CreateOrder;
