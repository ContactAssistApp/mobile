import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from 'assets/colors';
import CustomIcon from 'assets/icons/CustomIcon.js';

class Tip extends Component {
  render() {
    const {icon, title, content} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.title_wrapper}>
          <View style={styles.icon_wrapper}>
            <CustomIcon name={icon} color={colors.primary_theme} size={24} />
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.content}>{content}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: colors.card_border,
  },
  title_wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon_wrapper: {
    width: 40,
    height: 40,
    backgroundColor: colors.fill_on,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginRight: 15,
  },
  title: {
    flex: 1,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 23,
  },
  content: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.secondary_body_copy,
    paddingTop: 10,
  },
});

export default Tip;
