import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import Symptoms from './Symptoms';
import Report from './Report';
import colors from '../assets/colors';
import CustomIcon from '../assets/icons/CustomIcon.js';
import Calendar from '../views/Calendar';
import TabView from '../views/TabView';
import DateConverter from '../utils/date';
import {updateHealthData} from './actions.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

class Health extends Component {
  constructor() {
    super();
    this.state = {
      weekView: true,
    };
  }

  updateCalendarState = () => {
    this.setState({
      weekView: !this.state.weekView,
    });
  };

  render() {
    const tabs = ['symptoms', 'report'];
    const {
      healthData: {symptomsDate, tabIdx, symptomsMarkedDays},
    } = this.props;

    return (
      <>
        <SafeAreaView style={styles.status_bar} />
        <View style={styles.header}>
          <View style={styles.title_container}>
            <Image
              style={styles.logo}
              source={require('../assets/home/logo.png')}
            />
            <Text style={styles.title}>Health Report[DEMO]</Text>
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
          current={DateConverter.calendarFormat(symptomsDate)}
          markedDates={symptomsMarkedDays}
          handleDayPress={day => {
            this.props.updateHealthData({
              [`${tabs[tabIdx]}Date`]: DateConverter.calendarToDate(
                day.dateString,
              ),
            });
            this.setState({
              weekView: true,
            });
          }}
          weekView={this.state.weekView}>
          <TabView>
            <Symptoms
              tabLabel={'symptoms'}
              navigate={this.props.navigation.navigate}
            />
            <Report tabLabel={'diagnosis'} />
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

Health.propTypes = {
  updateHealthData: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    healthData: state.healthReducer,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateHealthData
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Health);
