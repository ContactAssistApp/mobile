import 'react-native-gesture-handler';
import React from 'react';
import colors from 'assets/colors';
import {StyleSheet, Text, View, Image} from 'react-native';

export default function Header(props) {
  const {title} = props;
  return (
    <View style={styles.title_container}>
      <Image style={styles.logo} source={require('../assets/home/logo.png')} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  status_bar: {
    backgroundColor: 'white',
  },
  logo: {
    width: 30,
    height: 28,
    marginRight: 10,
  },
  title: {
    color: colors.section_title,
    fontSize: 24,
    fontWeight: '500',
  },
  title_container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 17,
  },
});
