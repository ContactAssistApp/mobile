import React, {useState} from "react";
import {View, Switch, StyleSheet} from "react-native";
import colors from '../assets/colors';
import PropTypes from 'prop-types';

export default function Toggle(props) {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    props.handleToggle(!isEnabled);
  }

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{false:colors.GRAY_5, true:colors.PURPLE_50}}
        ios_backgroundColor={colors.GRAY_5}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
}

Toggle.propTypes = {
  handleToggle: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
});
