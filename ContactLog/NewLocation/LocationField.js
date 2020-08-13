import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import colors from 'assets/colors';
import CustomIcon from 'assets/icons/CustomIcon.js';
import Input from 'views/Input';

class LocationField extends Component {
  render() {
    const {icon, name, field, value} = this.props;
    return (
      <View style={styles.row}>
        {icon ? (
          <CustomIcon
            name={icon}
            color={colors.gray_icon}
            size={24}
            style={styles.icon}
          />
        ) : (
          <View style={styles.empty_cell} />
        )}
        <Input
          name={name}
          value={value}
          field={field}
          handleCallback={this.props.handleCallback}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  empty_cell: {
    width: 24,
    marginRight: 20,
  },
  icon: {
    paddingVertical: 15,
    marginRight: 20,
  },
});

export default LocationField;
