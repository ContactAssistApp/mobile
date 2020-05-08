import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import colors from '../assets/colors';
import Locations from './Locations';
import People from './People';
import CustomIcon from '../assets/icons/CustomIcon.js';
import {updateContactLog} from './actions.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Calendar from '../views/Calendar';
import TabView from '../views/TabView';
import {LocationData} from '../utils/LocationData';
import DateConverter from '../utils/date';

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
    this.fetchGpsLog();
  }

  updateCalendarState = () => {
    this.setState({
      weekView: !this.state.weekView,
    });
  };

  fetchGpsLog = async () => {
    const locations = await LocationData.getLocationData();

    let markedDates = {};
    let coordinates = {};
    locations.forEach(location => {
      const date = DateConverter.calendarFormat(new Date(location.time));
      if (!markedDates.hasOwnProperty(date)) {
        markedDates[date] = {marked: true};
      }

      if (coordinates.hasOwnProperty(date)) {
        coordinates[date].push(location);
      } else {
        coordinates[date] = [location];
      }
    });
    this.setState({
      markedDates,
    });

    this.props.updateContactLog({
      field: 'allCoordinates',
      value: coordinates,
    });
  };

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
            onPress={() => {
              this.updateCalendarState();
            }}>
            <CustomIcon
              name={'calendar24'}
              color={
                !this.state.weekView ? colors.primary_theme : colors.gray_icon
              }
              size={24}
            />
          </TouchableOpacity>
        </View>
        <Calendar
          current={this.state.date}
          markedDates={this.state.markedDates}
          handleDayPress={day => {
            this.setState({
              date: day.dateString,
              weekView: true,
            });
          }}
          weekView={this.state.weekView}>
          <TabView>
            <Locations tabLabel={'locations'} date={this.state.date} />
            <People tabLabel={'people'} />
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
