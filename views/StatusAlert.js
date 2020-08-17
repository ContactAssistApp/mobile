import React, {Component} from 'react';
import colors from 'assets/colors';
import PropTypes from 'prop-types';
import CustomIcon from 'assets/icons/CustomIcon.js';
import {StyleSheet, Text, View} from 'react-native';

class StatusAlert extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.showAlertCallback();
    }, 3000);
  }

  render() {
    const {status, text} = this.props;
    const containerClass = status === 'success'
        ? styles.success_container
        : styles.failure_container;

    return (
      <View style={[styles.container, containerClass]}>
        {status === 'success' ? (
          <CustomIcon
            name={'checkmark24'}
            color={colors.gray_icon}
            size={24}
            style={styles.icon}
          />
        ) : (
          <CustomIcon
            name={'close24'}
            color={colors.gray_icon}
            size={24}
            style={styles.icon}
          />
        )}
        <Text style={styles.content}>{text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 27,
  },
  success_container: {
    backgroundColor: '#CEF0CD',
  },
  failure_container: {
    backgroundColor: colors.card_border,
  },
  icon: {
    paddingRight: 5,
  },
  content: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
  },
});

StatusAlert.propTypes = {
  status: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default StatusAlert;
