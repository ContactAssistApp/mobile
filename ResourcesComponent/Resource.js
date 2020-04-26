import React, {Component} from 'react';
import {StyleSheet, Text, Image, TouchableOpacity, Linking} from 'react-native';
import colors from '../assets/colors';

class Resource extends Component {
  render() {
    const logos = {
      cdc: require('../assets/resources/cdc.png'),
      nyc: require('../assets/resources/nyc.png'),
    };
    const {logoName, title, url} = this.props;

    return (
      <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(url)}>
        <Image style={styles.logo} source={logos[logoName]} />
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  logo: {
    height: 40,
    width: 40,
    marginRight: 24,
  },
  title: {
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.408,
    color: colors.section_title,
  },
});

export default Resource;
