import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from 'assets/colors';

class StepIndicator extends Component {
  render() {
    return (
      <View style={styles.indicator_wrapper}>
        <View
          style={[
            styles.number_wrapper,
            this.props.selected ? styles.selected : '',
          ]}>
          <Text
            style={[
              styles.number,
              this.props.selected ? styles.selected_number : '',
            ]}>
            {this.props.number}
          </Text>
        </View>
        <Text style={styles.label}>{this.props.label}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  indicator_wrapper: {
    alignItems: 'center',
  },
  number_wrapper: {
    backgroundColor: colors.card_border,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  selected: {
    backgroundColor: colors.primary_theme,
  },
  number: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
    textAlign: 'center',
    color: colors.section_title,
  },
  selected_number: {
    color: 'white',
  },
  label: {
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
    color: colors.gray_icon,
  },
});

export default StepIndicator;
