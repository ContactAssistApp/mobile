import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import SymptomTracker from '../SymptomTracker/SymptomTracker';
import DateConverter from '../utils/date';
import CareTips from '../CareTips/CareTips';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getDaysWithLog} from '../realm/realmSymptomsTasks';
import {updateHealthData} from './actions.js';
import PropTypes from 'prop-types';

class Symptoms extends Component {
  componentDidMount() {
    this.fetchMarkedDays();
  }

  fetchMarkedDays = () => {
    let markedDates = {};
    const dates = getDaysWithLog();

    dates.forEach(date => {
      markedDates[date] = {marked: true};
    });

    this.props.updateHealthData({
      symptomsMarkedDays: markedDates,
    });
  };

  render() {
    const {
      healthData: {symptomsDate},
    } = this.props;

    return (
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.date}>
            {DateConverter.dateString(symptomsDate)}
          </Text>
        </View>
        <SymptomTracker date={symptomsDate} navigate={this.props.navigate} />
        <CareTips />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 0,
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 16,
    lineHeight: 24,
    color: '#212121',
  },
});

Symptoms.propTypes = {
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
)(Symptoms);
