import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import colors from 'assets/colors';

const Input = props => {
  const {name, field, value: initValue, customStyle} = props;
  const styleClasses = customStyle ? [styles.input, customStyle] : styles.input;
  const [value, onChangeText] = React.useState(initValue);
  React.useEffect(() => {
    onChangeText(initValue);
  }, [initValue]);

  return (
    <TextInput
      placeholder={name}
      style={styleClasses}
      onChangeText={text => {
        onChangeText(text);
        props.handleCallback(field, initValue, text);
      }}
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
