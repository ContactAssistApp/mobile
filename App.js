import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
} from 'react-native';

import Home from './Home/HomeContainer';

class App extends Component {
  render() {
    return (
      <>
      <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Home />
      </ScrollView>
      </SafeAreaView>
      </>
    );
  }
};

export default App;
