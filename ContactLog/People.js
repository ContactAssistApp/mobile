import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import colors from '../assets/colors';

class People extends Component {
  render() {
    return (
      <>
        <Text style={styles.header}>Social Interactions</Text>
        <Text style={styles.description}>
          Safely add people you’ve been in contact with directly from your contacts list, or one at a time.
        </Text>
      </>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    lineHeight: 25,
    textTransform: 'capitalize',
    color: colors.module_title,
    margin: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
    color: '#141414',
    padding: 20,
    backgroundColor: 'white',
  },
});

export default People;
