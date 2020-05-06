import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import colors from '../assets/colors';
import Locations from './Locations';
import People from './People';
import CustomIcon from '../assets/icons/CustomIcon.js';
import {updateContactLog} from './actions.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Calendar from '../views/Calendar';

class ContactLog extends Component {
  constructor() {
    super();
    this.state = {
      calendarExpand: false,
      markedDates: {},
    };
  }

  render() {
    return (
      <>
        <SafeAreaView style={styles.status_bar} />
        <View style={styles.header}>
          <View style={styles.title_container}>
            <Image
              style={styles.logo}
              source={require('../assets/home/logo.png')}
            />
            <Text style={styles.title}>Contact Log</Text>
          </View>
          <TouchableOpacity
            style={styles.calendar_button}
            onPress={this.toggleCalendar}>
            <CustomIcon
              name={'calendar24'}
              color={
                this.state.calendarExpand
                  ? colors.primary_theme
                  : colors.gray_icon
              }
              size={24}
            />
          </TouchableOpacity>
        </View>
        <Calendar
          markedDates={this.state.markedDates}
          handleDayPress={day => {
            this.props.updateContactLog({
              field: 'date',
              value: new Date(day.dateString.replace(/-/g, '/')),
            });
          }}>
          <ScrollableTabView
            initialPage={1}
            renderTabBar={() => {
              return (
                <DefaultTabBar
                  backgroundColor={'white'}
                  activeTextColor={colors.section_title}
                  inactiveTextColor={colors.gray_icon}
                  textStyle={{
                    fontWeight: '500',
                    textTransform: 'uppercase'
                  }}
                  underlineStyle={{
                    height: 2,
                    backgroundColor: colors.primary_theme
                  }}
                  tabStyle={{paddingTop: 10}}
                />
              );
            }}>
            <Locations tabLabel={'locations'} />
            <People tabLabel={'people'} />
          </ScrollableTabView>
        </Calendar>
      </>
    );
  }
}

const styles = StyleSheet.create({
  status_bar: {
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
    justifyContent: 'space-between',
  },
  title_container: {
    flexDirection: 'row',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  title: {
    fontSize: 24,
    color: colors.section_title,
    fontWeight: '500',
  },
});

ContactLog.propTypes = {
  updateContactLog: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateContactLog
}, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(ContactLog);
