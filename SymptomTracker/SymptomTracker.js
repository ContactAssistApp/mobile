import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import colors from '../assets/colors';
import Record from './Record';
import SQL from '../utils/SQL';
import PropTypes from 'prop-types';
import {updateSymptom} from './actions.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class SymptomTracker extends Component {
  constructor() {
    super();
    this.state = {
      records: [],
    };
  }
  componentDidMount() {
    const db = SQL.initDB();
    const createLogTable = 'CREATE TABLE IF NOT EXISTS SymptomLog(date VARCHAR(10) PRIMARY KEY NOT NULL, timeOfDate VARCHAR(2), timestamp INTEGER)';
    const createSymptomTable = 'CREATE TABLE IF NOT EXISTS Symptom(date VARCHAR(12) PRIMARY KEY NOT NULL, fever INTEGER, feverOnsetDate VARCHAR(5), feverTemperature INTEGER, feverDays INTEGER, abdominalPain INTEGER, chills INTEGER, cough INTEGER, coughOnsetDate VARCHAR(5), coughDays INTEGER, coughSeverity INTEGER, diarrhea INTEGER, difficultyBreathing INTEGER, headache INTEGER, muscleAches INTEGER, soreThroat INTEGER, vomiting INTEGER, other INTEGER)';

    SQL.createTable(db, createLogTable);
    SQL.createTable(db, createSymptomTable);
    const d = new Date();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    const todayDate = [year, month, day].join('');

    this.props.updateSymptom({
      field: 'date',
      value: todayDate,
    });

    this.fetchLog(db, todayDate).then(records => {
      this.setState({
        records,
      });
    });
    // SQL.closeDB(db);
  }

  fetchLog = async (db, todayDate) => {
    const sql = `SELECT * FROM SymptomLog WHERE date = ${todayDate}`;
    const result = await SQL.get(db, sql);

    return result;
  };

  dateSuffix = today => {
    let todayObj = today;
    if (/1/.test(parseInt((todayObj + '').charAt(0), 10))) {
      return 'th';
    }
    todayObj = parseInt((todayObj + '').charAt(1), 10);
    return todayObj === 1
      ? 'st'
      : todayObj === 2
      ? 'nd'
      : todayObj === 3
      ? 'rd'
      : 'th';
  };

  render() {
    let today = new Date();
    const weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const dayOfWeek = weekday[today.getDay()];

    const dayOfMonth =
      today.getDate() < 10
        ? '0' + today.getDate() + this.dateSuffix(today)
        : today.getDate() + this.dateSuffix(today);

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const curMonth = months[today.getMonth()];
    let todayString = `${dayOfWeek}, ${curMonth} ${dayOfMonth}`;
    return (
      <View style={styles.container}>
        <View style={styles.header_container}>
          <Text style={styles.header}>Symptom Tracker</Text>
          <Text style={styles.description}>{todayString}</Text>
        </View>
        <Record
          timeOfDay={'AM'}
          logTime={''}
          navigate={this.props.navigate}
        />
        <Record
          timeOfDay={'PM'}
          logTime={''}
          navigate={this.props.navigate}
        />
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
  header_container: {
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    lineHeight: 26,
    textTransform: 'capitalize',
    color: colors.module_title,
  },
  description: {
    fontSize: 14,
    lineHeight: 16,
    color: colors.secondary_body_copy,
  },
});

SymptomTracker.propTypes = {
  navigate: PropTypes.func.isRequired,
  updateSymptom: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    symptoms: state.symptomReducer,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateSymptom
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SymptomTracker);
