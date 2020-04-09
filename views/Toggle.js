import React from 'react';
import {View, Switch, StyleSheet} from 'react-native';
import colors from '../assets/colors';
import PropTypes from 'prop-types';

export default function Toggle(props) {
  const toggleSwitch = () => {
    props.handleToggle(!props.value);
  };

  return (
    <Switch
      trackColor={{false: colors.card_border, true: colors.primary_theme}}
      ios_backgroundColor={colors.fill_off}
      onValueChange={toggleSwitch}
      value={props.value}
    />
  );
}

Toggle.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
};
