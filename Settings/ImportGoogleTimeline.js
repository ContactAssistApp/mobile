import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../assets/colors';

class ImportGoogleTimeline extends Component {
  render() {
    return (
      <View style={styles.row}>
        <Icon
          name={'logo-google'}
          color={colors.gray_icon}
          size={24}
          style={styles.icon}
        />
        <View style={styles.content}>
          <Text style={styles.title}>Import Location History</Text>
        </View>

        <TouchableOpacity onPress={() => console.log('hi')}>
          <Text style={styles.button}>Import</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
  },
  icon: {
    flex: 1,
    paddingRight: 15,
    paddingLeft: 3,
  },
  content: {
    flex: 11,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.408,
    color: colors.body_copy,
  },
  button: {
    flex: 1,
    padding: 8,
    color: colors.icon_on,
    fontWeight: 'bold',
  },
});

export default ImportGoogleTimeline;
