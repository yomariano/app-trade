import React, { Component } from "react";
import { SafeAreaView, FlatList, StyleSheet, Alert, ScrollView, RefreshControl } from "react-native";
import { List, ListItem } from "react-native-elements";

import backend from "../server";
import keys from "../server/config";

class OpenOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loading: true,
      orders: [],
      completeBalances: []
    };
  }
  componentDidMount() {
    this.onGetCompleteBalances();
  }

  onGetCompleteBalances() {
    this.setState({ refreshing: true });
    this.setState({
      completeBalances: []
    });
    const wall = keys.WALLET_ADDRESS;
    backend
      .returnCompleteBalances(wall)
      .then(response => {
        var obj = JSON.parse(response);
        console.table(obj)
        Object.keys(obj).map(k => {
          if (Number(obj[k]["onOrders"]) == 0) return;
          backend.returnOpenOrders("ETH_" + k ,wall)
          .then(response => {
            var obj = JSON.parse(response);
            console.table(obj)
            Object.keys(obj).map(order => {
            this.setState({
              completeBalances: [
                ...this.state.completeBalances,
                { 
                  key: obj[order]["orderHash"], 
                  value:obj[order]["amount"],
                  title: obj[order]["market"], 
                  subtitle: "Amount: " + obj[order]["amount"] + " Price: " + obj[order]["price"]}// Number(response["amount"]).toFixed(2), price: response["price"].toFixed(2) }
              ]
            });
            })

            
          });         
        });
        this.setState({ refreshing: false });

      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  }

  onCancelOrder(token){
    backend
      .cancelAPI(token)
      .then(response => {
        this.setState({
          completeBalances: []
        });
        this.onGetCompleteBalances();
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });

  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={() => this.onGetCompleteBalances()}
          />
      }>
      
      <SafeAreaView>
       
        <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
          <FlatList
            data={this.state.completeBalances}
            renderItem={({ item }) => (
              <ListItem
                onPress={() =>
                  Alert.alert(
                    "Cancel",
                    "Are you sure want to cancel?",
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      },
                      { text: "OK", onPress: () => this.onCancelOrder(item.title) }
                    ],
                    { cancelable: false }
                  )
                }
                title={item.title}
                subtitle={item.subtitle}
                containerStyle={{ borderBottomWidth: 0 }}
              />
            )}
            keyExtractor={item => item.key}
            onRefresh={() => this.onGetCompleteBalances()}
            refreshing={this.state.refreshing}
          />
        </List>
      </SafeAreaView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

export default OpenOrders;
