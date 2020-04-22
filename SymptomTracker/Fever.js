import React, {Component} from 'react';
import {StyleSheet, Text, TextInput} from 'react-native';
import colors from '../assets/colors';
import PropTypes from 'prop-types';

class Fever extends Component {
  render() {
    return (
      <>
        <Text>Onset Date:</Text>
        <TextInput />
        <Text>Highest Temperature:</Text>
        <TextInput />
        <Text>Days Experienced:</Text>
        <TextInput />
      </>
    );
  }
}

const styles = StyleSheet.create({

});

Fever.propTypes = {
  // timeOfDay: PropTypes.string.isRequired,
};

export default Fever;
