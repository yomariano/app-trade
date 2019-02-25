import React, { Component } from "react";
import {
  SafeAreaView,
  FlatList,
  ScrollView,
  RefreshControl
} from "react-native";
import { List, ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
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

  onGetBalances = async () => {
    this.setState({ refreshing: true });
    this.setState({
      balances: []
    });

    let balances = await backend.returnBalances(keys.WALLET_ADDRESS);

    try {
      var obj = JSON.parse(balances);
      Object.keys(obj).map(k => {
        if (Number(obj[k]) < 0.01) return;
        this.setState({
          balances: [
            ...this.state.balances,
            { key: k, value: Number(obj[k]).toFixed(2) }
          ]
        });
      });

      this.setState({ refreshing: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => this.onGetBalances()}
          />
        }
      >
        <SafeAreaView>
          <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
            <FlatList
              data={this.state.balances}
              renderItem={({ item }) => (
                <ListItem
                  onPress={() =>
                    navigate("CreateOrder", {
                      key: item.key,
                      value: item.value
                    })
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
      </ScrollView>
    );
  }
}

export default Balance;
