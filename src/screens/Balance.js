import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  FlatList
} from "react-native";
import { List, ListItem } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';
import backend from "../server";
import keys from "../server/config";

class Balance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loading: true,
      balances: [],
      arr: []
    };
  }

  componentDidMount() {
  //  this.onGetTicker();
    this.onGetBalances();
  }

  onGetBalances() {
const wall = keys.WALLET_ADDRESS;
    backend.returnBalances(wall)
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

  onGetTicker() {
    backend.returnTicker("ETH_HOT").then(response => {
      var obj = JSON.parse(response);
      obj["ticker"] = "ETH_HOT";
      obj["avatar"] = "https://pbs.twimg.com/profile_images/937033951201366016/V_sr4wTk_400x400.jpg";

      this.setState({
        arr: [...this.state.arr, obj]
      });
    });

    backend.returnTicker("ETH_TRAC").then(response => {
      var obj = JSON.parse(response);
      obj["ticker"] = "ETH_TRAC";
      obj["avatar"] = "https://pbs.twimg.com/profile_images/910900381370208256/O0DkEy27_400x400.jpg";

      this.setState({
        arr: [...this.state.arr, obj]
      });
    });
  }

  render() {
    const {navigate} = this.props.navigation;

    return (
      <SafeAreaView>
        <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
        <FlatList
          data={this.state.balances}
          renderItem={({ item }) => (
            <ListItem
            onPress={() => navigate('CreateOrder', {
              key: item.key,
              value: item.value,
            })}
             title={item.key}
             subtitle={item.value}
              containerStyle={{ borderBottomWidth: 0 }}
           
            />
          )}  
          keyExtractor={item => item.key}
        />
      </List>
      </SafeAreaView>


      
    );
  }
}

export default Balance;
