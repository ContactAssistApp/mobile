import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Home from './Home/HomeContainer';
import configureStore from './store/configureStore';
import {Provider} from 'react-redux';

const store = configureStore();

class App extends Component {
  render() {
    return (
      <>
        <Provider store={store}>
          <SafeAreaView>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
              <Home />
            </ScrollView>
          </SafeAreaView>
        </Provider>
      </>
    );
  }
};

export default App;
