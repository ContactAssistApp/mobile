import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {GetStoreData} from './utils/asyncStorage';
import {Provider} from 'react-redux';
import Nav from './Nav/Nav';
import SplashScreen from 'react-native-splash-screen';
import colors from './assets/colors.js';
import configureStore from './store/configureStore';
import FTUE from './FTUE/FTUE';

const store = configureStore();

function App() {
  const [statusFetched, setStatusFetched] = useState(false);
  const [enableFTUE, setEnableFTUE] = useState('true');

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  getEnableFTUE().then(data => {
    if (data) {
      setEnableFTUE(() => data);
    }
    setStatusFetched(() => true);
  });

  function getEnableFTUE() {
    return GetStoreData('ENABLE_FTUE').then(val => {
      return val;
    });
  }

  function handleCompleteFTUE() {
    setEnableFTUE(() => 'false');
  }

  return (
    <Provider store={store}>
      {statusFetched
        ? enableFTUE === 'true'
          ? <FTUE handleOnDone={handleCompleteFTUE}/>
          : <Nav />
        : <View style={styles.loading_spinner}>
            <ActivityIndicator size={'large'} color={colors.primary_theme} />
          </View>
      }
    </Provider>
  );
}

const styles = StyleSheet.create({
  loading_spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default App;
