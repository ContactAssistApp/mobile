import React, {Component} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import colors from '../assets/colors';
import CustomIcon from '../assets/icons/CustomIcon.js';

class Import extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/health/map.png')} />
        <Text style={styles.title}>
          Sync your location history{'\n'}to get started.
        </Text>
        <Text style={styles.description}>
          Import your timeline data from Google to sync your locations quickly. You can also add locations one by one.
        </Text>
        <TouchableOpacity style={styles.button}>
          <CustomIcon
            name={'import24'}
            color={'white'}
            size={16}
            style={styles.import_icon}
          />
          <Text style={styles.button_text}>Import</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 55,
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    textTransform: 'capitalize',
    color: colors.section_title,
    textAlign: 'center',
    paddingBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 16,
    textAlign: 'center',
    color: colors.secondary_body_copy,
    paddingBottom: 15,
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 16.5,
    paddingHorizontal: 20,
    backgroundColor: colors.primary_theme,
    borderRadius: 4,
  },
  import_icon: {
    paddingRight: 10,
  },
  button_text: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
    textTransform: 'uppercase',
    color: 'white',
  },
});

export default Import;
