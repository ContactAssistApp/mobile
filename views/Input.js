import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import colors from 'assets/colors';

const Input = props => {
  const {name, value: initValue} = props;
  const [value, onChangeText] = React.useState(initValue);
  React.useEffect(() => {
    onChangeText(initValue);
  }, [initValue]);

  return (
    <TextInput
      placeholder={name}
      style={styles.input}
      onChangeText={text => onChangeText(text)}
      value={value}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
    paddingVertical: 15,
    width: '100%',
  },
});

export default Input;
