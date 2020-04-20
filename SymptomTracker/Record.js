import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CustomIcon from '../assets/icons/CustomIcon.js';
import colors from '../assets/colors';
import PropTypes from 'prop-types';

class Record extends Component {
  render() {
    const {timeOfDay} = this.props;
    return (
      <>
        <View style={styles.record}>
          <View style={styles.icon_wrapper}>
            <CustomIcon
              name={'edit24'}
              color={colors.gray_icon}
              size={24}
              style={styles.record_icon}
            />
          </View>
          <View style={styles.record_detail}>
            <Text style={styles.title}>{timeOfDay}</Text>
            <Text style={styles.time}>time</Text>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  record: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  icon_wrapper: {
    backgroundColor: colors.fill_off,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  record_detail: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.module_title,
  },
  time: {
    fontSize: 14,
    lineHeight: 16,
    color: colors.secondary_body_copy,
  },
});

Record.propTypes = {
  timeOfDay: PropTypes.string.isRequired,
};

export default Record;
