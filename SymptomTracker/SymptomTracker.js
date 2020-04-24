import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../assets/colors';
import Record from './Record';
import PropTypes from 'prop-types';
import {updateSymptom} from './actions.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {GetStoreData} from '../utils/asyncStorage';
import DateConverter from '../utils/date';

class SymptomTracker extends Component {
  constructor() {
    super();
    this.state = {
      amLog: null,
      pmLog: null,
    };
  }

  componentDidMount() {
    const d = DateConverter.calendarFormat(this.props.date);
    this.props.updateSymptom({
      date: d,
    });

    this.fetchLog(d);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.date.getTime() !== this.props.date.getTime()) {
      const d = DateConverter.calendarFormat(this.props.date);
      this.props.updateSymptom({
        date: d,
      });

      this.fetchLog(d);
    }
  }

  fetchLog = async d => {
    let amLog = await GetStoreData(`SYMPTOM_${d}_AM`);
    let pmLog = await GetStoreData(`SYMPTOM_${d}_PM`);
    this.setState({
      amLog: JSON.parse(amLog),
      pmLog: JSON.parse(pmLog),
    });
  };

  render() {
    let dateString = DateConverter.dateString(this.props.date);
    return (
      <View style={styles.container}>
        <View style={styles.header_container}>
          <Text style={styles.header}>Symptom Tracker</Text>
          <Text style={styles.description}>{dateString}</Text>
        </View>
        <Record
          timeOfDay={'AM'}
          logTime={
            this.state.amLog
            ? DateConverter.timeString(this.state.amLog.ts)
            : ''
          }
          navigate={this.props.navigate}
        />
        <Record
          timeOfDay={'PM'}
          logTime={
            this.state.pmLog
            ? DateConverter.timeString(this.state.pmLog.ts)
            : ''
          }
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
