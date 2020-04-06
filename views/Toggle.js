import React from 'react';
import {View, Switch, StyleSheet} from 'react-native';
import colors from '../assets/colors';
import PropTypes from 'prop-types';

export default function Toggle(props) {
  const toggleSwitch = () => {
    props.handleToggle(!props.value);
  };

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{false: colors.GRAY_5, true: colors.PURPLE_50}}
        ios_backgroundColor={colors.GRAY_5}
        onValueChange={toggleSwitch}
        value={props.value}
      />
    </View>
  );
}

Toggle.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
