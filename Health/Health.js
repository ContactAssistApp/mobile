import React, {Component} from 'react';
import {SafeAreaView, View, StyleSheet, TouchableOpacity} from 'react-native';
import Symptoms from './Symptoms';
import colors from 'assets/colors';
import CustomIcon from 'assets/icons/CustomIcon.js';
import Calendar from 'views/Calendar';
import Header from 'views/Header';
import DateConverter from 'utils/date';
import {updateHealthData} from './actions.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {strings} from 'locales/i18n';

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
    const {
      healthData: {symptomsDate, symptomsMarkedDays},
    } = this.props;
    return (
      <>
        <SafeAreaView style={styles.status_bar} />
        <View style={styles.header}>
          <Header title={strings('bottom.sheet_menu_item_health_report')} />
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
              symptomsDate: DateConverter.calendarToDate(day.dateString),
            });
            this.setState({
              weekView: true,
            });
          }}
          weekView={this.state.weekView}
        />
        <Symptoms navigate={this.props.navigation.navigate} />
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
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
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
