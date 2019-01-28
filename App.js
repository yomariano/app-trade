import React, { Component } from "react";
import {Platform} from 'react-native';
import {createAppContainer, createMaterialTopTabNavigator } from 'react-navigation';
import Balance from './src/screens/Balance';
import CreateOrder from './src/screens/CreateOrder';
import OpenOrders from './src/screens/OpenOrders';
// import CreateOrder from './src/screens/CreateOrder';
import NotifService from './src/screens/NotifService';
import {
  Alert
} from "react-native";
import keys from "./src/server/config";



const NavStack = createMaterialTopTabNavigator({
  Balance: { 
      screen: Balance,
  },
  CreateOrder: { 
    screen: CreateOrder,
  },
  OpenOrders: { 
    screen: OpenOrders,
  }
},
{
  lazy: true,
  
});

const TabContainer = createAppContainer(NavStack);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      senderId: keys.SENDER_ID
    };

    this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
    this.notif.configure(this.onRegister.bind(this), this.onNotif.bind(this), this.state.senderId)
  }

 

  
  onRegister(token) {
    console.log(token);
    this.setState({ registerToken: token.token, gcmRegistered: true });
  }

  onNotif(notif) {
    console.log(notif);
    Alert.alert(notif.title, notif.message);
  }
  
  render() {
    return (
      <TabContainer />
    );
  }
}

