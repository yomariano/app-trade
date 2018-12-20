import {Platform} from 'react-native';
import {createAppContainer, createMaterialTopTabNavigator } from 'react-navigation';
import Balance from './src/screens/Balance';
import Trades from './src/screens/Trades';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const NavStack = createMaterialTopTabNavigator({
  Balance: { 
      screen: Balance,
  },
  Trades: { 
    screen: Trades,
  }
});

const App = createAppContainer(NavStack);

export default App;

// export default class App extends Component {
  
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>Welcome to React Native!</Text>
//         <Text style={styles.instructions}>To get started, edit App.js</Text>
//         <Text style={styles.instructions}>{instructions}</Text>
//       </View>
//     );
//   }
// }

