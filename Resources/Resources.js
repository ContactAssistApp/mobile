import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import colors from '../assets/colors';

class Resources extends Component {
  render() {
    return (
      <>
        <SafeAreaView style={styles.status_bar} />
        <SafeAreaView>
          <View style={styles.header}>
            <Image
              style={styles.logo}
              source={require('../assets/home/logo.png')}
            />
          <Text style={styles.title}>Resources</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  status_bar: {
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  title: {
    fontSize: 24,
    color: colors.section_title,
    fontWeight: '500',
  },
});

export default Resources;
