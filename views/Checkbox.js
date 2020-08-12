import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import colors from 'assets/colors';

const CheckBox = ({selected, onPress, text = '', ...props}) => (
  <TouchableOpacity style={styles.checkBox} onPress={onPress} {...props}>
    <Icon
      size={24}
      color={selected ? colors.primary_theme : colors.gray_icon}
      name={selected ? 'check-box' : 'check-box-outline-blank'}
      style={styles.icon}
    />
    {text !== '' && <Text style={styles.text}>{text}</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  checkBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    paddingRight: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
});
export default CheckBox;
