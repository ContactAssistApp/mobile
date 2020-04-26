import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../assets/colors';
import CustomIcon from '../assets/icons/CustomIcon.js';

class Emergency extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.icon_wrapper}>
          <CustomIcon
            name={'phone24'}
            color={colors.secondary_theme}
            size={24}
          />
        </View>
        <Text style={styles.text}>
          Call 911 immediately if you are having a medical emergency.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon_wrapper: {
    width: 40,
    height: 40,
    backgroundColor: colors.chip_moderate,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginRight: 24,
  },
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
    color: colors.gray_icon,
  },
});

export default Emergency;
