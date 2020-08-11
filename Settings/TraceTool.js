import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CustomIcon from 'assets/icons/CustomIcon.js';
import PropTypes from 'prop-types';
import Toggle from 'views/Toggle';
import colors from 'assets/colors';

class TraceTool extends Component {
  render() {
    const {iconName, title, description, toggleValue} = this.props;
    return (
      <View style={styles.row}>
        <CustomIcon
          name={iconName}
          color={colors.gray_icon}
          size={24}
          style={styles.icon}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <Toggle
          handleToggle={selectedState => {
            this.props.handleToggle(selectedState);
          }}
          value={toggleValue}
          style={styles.toggle}
        />
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
  },
  icon: {
    flex: 1,
    paddingRight: 15,
  },
  content: {
    flex: 11,
  },
  toggle: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.408,
    color: colors.body_copy,
    paddingBottom: 5,
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.secondary_body_copy,
  },
});

TraceTool.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  iconName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  toggleValue: PropTypes.bool.isRequired,
};

export default TraceTool;
