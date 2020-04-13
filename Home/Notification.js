import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from '../assets/colors';
import PropTypes from 'prop-types';

class Notification extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>You May Have Been Exposed</Text>
        {
          this.props.notifications.map(notification => {
            return (
              <Text style={styles.message}>{notification}</Text>
            );
          })
        }
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
    marginHorizontal: 10,
  },
  title: {
    color: '#EF0976',
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: 0.35,
  },
  message: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: '#6E6E6E',
    paddingVertical: 15,
  }
});

Notification.propTypes = {
  notifications: PropTypes.array.isRequired,
};

export default Notification;
