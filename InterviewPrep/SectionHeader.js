import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import colors from 'assets/colors';

class SectionHeader extends Component {
  render() {
    return <Text style={styles.header}>{this.props.header}</Text>;
  }
}

const styles = StyleSheet.create({
  header: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 18,
    textTransform: 'uppercase',
    color: colors.secondary_body_copy,
    padding: 20,
    backgroundColor: colors.card_border,
  },
});

export default SectionHeader;
