import React, {Component} from 'react';
import {StyleSheet, Text, TextInput} from 'react-native';
import colors from '../assets/colors';
import PropTypes from 'prop-types';

class Fever extends Component {
  render() {
    return (
      <>
        <Text>Onset Date:</Text>
        <TextInput style={styles.inputbox} />
        <Text>Highest Temperature:</Text>
        <TextInput style={styles.inputbox} />
        <Text>Days Experienced:</Text>
        <TextInput style={styles.inputbox} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  inputbox: {
    marginBottom: 20,
    height: 40,
    width: 200,
    borderBottomColor: colors.primary_theme,
    borderBottomWidth: 1,
  },
});

Fever.propTypes = {
  // timeOfDay: PropTypes.string.isRequired,
};

export default Fever;
