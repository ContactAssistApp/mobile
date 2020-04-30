import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../assets/colors';
import PropTypes from 'prop-types';
import CustomIcon from '../assets/icons/CustomIcon.js';

class Notification extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <CustomIcon
            name={'warning24'}
            color={colors.warning_high}
            size={20} />
          <Text style={styles.title}>You May Have Been Exposed</Text>
        </View>
        {this.props.notifications.map((notification, idx) => {
          return (
            <Text key={`notification_${idx}`} style={styles.message}>
              {notification}
            </Text>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 20,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDE7E9',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  title: {
    color: colors.warning_high,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    paddingLeft: 5,
  },
  message: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.secondary_body_copy,
    paddingVertical: 15,
  },
});

Notification.propTypes = {
  notifications: PropTypes.array.isRequired,
};

export default Notification;
