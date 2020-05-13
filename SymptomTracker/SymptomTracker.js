import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../assets/colors';
import Record from './Record';
import PropTypes from 'prop-types';
import {updateSymptom, resetSymptoms} from './actions.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {GetStoreData} from '../utils/asyncStorage';
import DateConverter from '../utils/date';
import { strings } from '../locales/i18n';

class SymptomTracker extends Component {
  componentDidMount() {
    const d = DateConverter.calendarFormat(this.props.date);
    this.props.updateSymptom({
      date: d,
    });

    this.fetchLog(d);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.date.getTime() !== this.props.date.getTime()) {
      this.props.resetSymptoms();
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
    if (amLog) {
      amLog = JSON.parse(amLog);
      this.props.updateSymptom({
        amTs: amLog.amTs,
      });
    }
    if (pmLog) {
      pmLog = JSON.parse(pmLog);
      this.props.updateSymptom({
        pmTs: pmLog.pmTs,
      });
    }
  };

  render() {
    const dateString = DateConverter.dateString(this.props.date);
    const {
      symptoms: {amTs, pmTs},
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.header_container}>
          <Text style={styles.header}>{strings("symptom.tracker_text")}</Text>
          <Text style={styles.description}>{dateString}</Text>
        </View>
        <Record
          timeOfDay={strings("time.am")}
          logTime={amTs ? DateConverter.timeString(amTs) : ''}
          navigate={this.props.navigate}
        />
        <Record
          timeOfDay={strings("time.pm")}
          logTime={pmTs ? DateConverter.timeString(pmTs) : ''}
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
    margin: 16,
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
  resetSymptoms: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    symptoms: state.symptomReducer,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateSymptom,
  resetSymptoms
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SymptomTracker);
