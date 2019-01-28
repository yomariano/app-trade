import React, { Component } from "react";
import { SafeAreaView, FlatList, StyleSheet, Alert } from "react-native";
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
    const wall = keys.WALLET_ADDRESS;
    backend
      .returnCompleteBalances(wall)
      .then(response => {
        var obj = JSON.parse(response);
        Object.keys(obj).map(k => {
          if (Number(obj[k]["onOrders"]) == 0) return;
          this.setState({
            completeBalances: [
              ...this.state.completeBalances,
              { key: k, value: Number(obj[k]["onOrders"]).toFixed(2) }
            ]
          });
        });
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
                      { text: "OK", onPress: () => this.onCancelOrder(item.key) }
                    ],
                    { cancelable: false }
                  )
                }
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
