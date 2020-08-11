import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from 'assets/colors';
import PropTypes from 'prop-types';
import CustomIcon from 'assets/icons/CustomIcon.js';
import DateConverter from 'utils/date';
import {strings} from 'locales/i18n';

class Notification extends Component {
  constructor(props) {
    super();
    this.state = {
      index: 0,
    };
  }

  handleOnPress = () => {
    this.setState({index: 1});
  };

  handleDismiss = () => {
    this.setState({
      display: false,
    });
  };

  render() {
    const {notifications} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.container_header}>
          <CustomIcon name={'alert24'} color={'#8F761E'} size={20} />
          <Text style={styles.title}>{strings('narrowcast.alerts')}[DEMO]</Text>
        </View>
        {notifications.map((notification, idx) => {
          if (this.state.index % notifications.length === idx) {
            const {
              title,
              street,
              city,
              state,
              zip,
              description,
              beginTime,
              endTime,
            } = notification;

            return (
              <View
                style={styles.content_container}
                key={`notification_${idx}`}>
                <Text style={styles.card_title}>{title}</Text>
                <View style={styles.card_line_wrapper}>
                  <CustomIcon
                    name={'location24'}
                    color={colors.gray_icon}
                    size={20}
                    style={styles.card_content_icon}
                  />
                  <View>
                    <Text style={styles.card_line}>{street}</Text>
                    <Text style={styles.card_line}>
                      {`${city}, ${state} ${zip}`}
                    </Text>
                  </View>
                </View>
                <View style={styles.card_line_wrapper}>
                  <CustomIcon
                    name={'calendar24'}
                    color={colors.gray_icon}
                    size={20}
                    style={styles.card_content_icon}
                  />
                  <Text style={styles.card_line}>
                    {`${DateConverter.dateString(new Date(beginTime))} - ${DateConverter.dateString(new Date(endTime))}`}
                  </Text>
                </View>
                <Text style={styles.message}>{description}</Text>
              </View>
            );
          }
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 20,
    marginHorizontal: 16,
  },
  title: {
    color: '#8F761E',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    paddingLeft: 5,
  },
  message: {
    letterSpacing: -0.24,
    paddingVertical: 15,
    fontSize: 14,
    lineHeight: 20,
  },
  container_header: {
    flexDirection: 'row',
    paddingVertical: 17,
    paddingHorizontal: 21,
    backgroundColor: colors.chip_moderate,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  content_container: {
    paddingHorizontal: 18,
  },
  card_title: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '500',
    paddingVertical: 15,
  },
  card_content_icon: {
    paddingRight: 5,
  },
  card_line_wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  card_line: {
    fontSize: 14,
    lineHeight: 20,
  },
});

Notification.propTypes = {
  notifications: PropTypes.array.isRequired,
};

export default Notification;
