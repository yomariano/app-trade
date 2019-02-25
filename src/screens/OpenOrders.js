import React, { Component } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl
} from "react-native";
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

  onGetCompleteBalances = async () => {
    this.setState({ refreshing: true });
    this.setState({
      completeBalances: []
    });
    let arr = [];

    try {
      let orders = await backend.returnOrderBookForUser(
        "0x6912cCC1E60d282607cb88D55E9bf20c2e06a13c"
      );
      let ticker = await backend.returnCurrencies();
      let objOrders = JSON.parse(orders);

      Object.keys(objOrders).map(async o => {
        let objTickers = JSON.parse(ticker);
        Object.keys(objTickers).map(async e => {
          if (
            objTickers[e]["address"] == objOrders[o].tokenSell &&
            e !== "ETH"
          ) {
            arr.push("ETH_" + e);
          }
          if (
            objTickers[e]["address"] == objOrders[o].tokenBuy &&
            e !== "ETH"
          ) {
            arr.push("ETH_" + e);
          }
        });
      });
    } catch (e) {
      console.error("err => ", e);
    }

    Object.keys(arr).map(async e => {
      let openOrders = await backend.returnOpenOrders(
        arr[e],
        keys.WALLET_ADDRESS
      );
      let objOpenOrders = JSON.parse(openOrders);

      Object.keys(objOpenOrders).map(order => {
        this.setState({
          completeBalances: [
            ...this.state.completeBalances,
            {
              key: objOpenOrders[order]["orderHash"],
              value: Number(objOpenOrders[order]["amount"]).toFixed(2),
              title: objOpenOrders[order]["market"],
              subtitle:
                "Amount: " +
                Number(objOpenOrders[order]["amount"]).toFixed(2) +
                " Price: " +
                objOpenOrders[order]["price"]
            }
          ]
        });
      });
    });

    this.setState({ refreshing: false });
  };

  onCancelOrder(token) {
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
        }
      >
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
                        {
                          text: "OK",
                          onPress: () => this.onCancelOrder(item.title)
                        }
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
