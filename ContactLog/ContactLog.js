import React, {Component} from 'react';
import {SafeAreaView, View, StyleSheet, TouchableOpacity} from 'react-native';
import colors from 'assets/colors';
import Locations from './Location/Container';
import People from './People';
import CustomIcon from 'assets/icons/CustomIcon.js';
import {updateContactLog} from './actions.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Calendar from 'views/Calendar';
import TabView from 'views/TabView';
import Header from 'views/Header';
import DateConverter from 'utils/date';
import {getDaysWithLocations} from 'realm/realmLocationTasks';
import {strings} from 'locales/i18n';

class ContactLog extends Component {
  constructor() {
    super();
    this.state = {
      date: DateConverter.calendarFormat(new Date()),
      weekView: true,
      markedDates: {},
    };
  }

  componentDidMount() {
    this.fetchMarkedDays();
  }

  fetchMarkedDays = async () => {
    let markedDates = {};
    const dates = await getDaysWithLocations();

    dates.forEach(date => {
      markedDates[date] = {marked: true};
    });

    this.setState({
      markedDates,
    });
  };

  updateCalendarState = () => {
    this.setState({
      weekView: !this.state.weekView,
    });
  };

  render() {
    const {date, weekView, markedDates} = this.state;
    return (
      <>
        <SafeAreaView style={styles.status_bar} />
        <View style={styles.header}>
          <Header title={strings('bottom.sheet_menu_item_contact_log')} />
          <TouchableOpacity
            style={styles.calendar_button}
            onPress={() => {
              this.updateCalendarState();
            }}>
            <CustomIcon
              name={'calendar24'}
              color={!weekView ? colors.primary_theme : colors.gray_icon}
              size={24}
            />
          </TouchableOpacity>
        </View>
        <Calendar
          current={date}
          markedDates={markedDates}
          handleDayPress={day => {
            this.setState({
              date: day.dateString,
              weekView: true,
            });
          }}
          weekView={weekView}>
          <TabView>
            <Locations tabLabel={strings('locations.text')} date={date} />
            <People tabLabel={strings('people.text')} />
          </TabView>
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
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
    justifyContent: 'space-between',
    alignItems: 'center',
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
