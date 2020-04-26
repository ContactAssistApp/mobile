import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../assets/colors';
import CustomIcon from '../assets/icons/CustomIcon.js';

class Tip extends Component {
  render() {
    const {icon, title, content} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.icon_wrapper}>
          <CustomIcon name={icon} color={colors.primary_theme} size={24} />
        </View>
        <View style={styles.content_wrapper}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.content}>{content}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  icon_wrapper: {
    width: 40,
    height: 40,
    backgroundColor: colors.fill_on,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginRight: 24,
  },
  content_wrapper: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.408,
    paddingBottom: 5,
  },
  content: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.secondary_body_copy,
  },
});

export default Tip;
