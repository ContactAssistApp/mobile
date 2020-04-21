import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import CustomIcon from '../assets/icons/CustomIcon.js';
import colors from '../assets/colors';
import PropTypes from 'prop-types';
import Accordion from '../views/Accordion';

class SymptomForm extends Component {
  render() {
    const {} = this.props;
    return (
      <>
        <Text>Select Your Symptoms:</Text>
      </>
    );
  }
}

const styles = StyleSheet.create({
  record: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  icon_wrapper: {
    backgroundColor: colors.fill_off,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  record_detail: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.module_title,
  },
  time: {
    fontSize: 14,
    lineHeight: 16,
    color: colors.secondary_body_copy,
  },
});

SymptomForm.propTypes = {
  timeOfDay: PropTypes.string.isRequired,
  logTime: PropTypes.string.isRequired,
};

export default SymptomForm;
