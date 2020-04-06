import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from '../assets/colors';

class Resources extends Component {
  render() {
    return (
      <SafeAreaView>
        <View style={styles.header}>
          <Text style={styles.title}>Resources</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.PURPLE_50,
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: '500',
  },
});

export default Resources;
