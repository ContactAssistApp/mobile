import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../assets/colors';
import {LocalizationContext} from '../components/Translations';

class Privacy extends Component {
  static contextType = LocalizationContext;
  
  render() {
    const {translations, initializeAppLanguage} = this.context;
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
		{translations["privacyDisclaimer2"]}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: colors.fill_off,
    marginHorizontal: 25,
    marginBottom: 40,
    padding: 15,
  },
  text: {
    fontSize: 13,
    lineHeight: 15,
    color: '#141414',
  },
});

export default Privacy;
