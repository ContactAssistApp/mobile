import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import colors from 'assets/colors';
import {connect} from 'react-redux';
import Privacy from 'Privacy/Privacy';
import SymptomsHalfDay from './SymptomsHalfDay';
import {strings} from 'locales/i18n';

class SymptomsSummary extends Component {
  render() {
    const {symptoms} = this.props;

    return (
      <>
        <Text style={styles.symptom_header}>{strings('symptoms.text')}</Text>
        <SymptomsHalfDay symptoms={symptoms} />
        <Privacy />
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  symptom_header: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 18,
    textTransform: 'uppercase',
    color: colors.secondary_body_copy,
    padding: 20,
    backgroundColor: colors.card_border,
    marginBottom: 15,
  },
  symptom_card: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
  },
  symptom_name: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 23,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.body_copy,
    paddingRight: 5,
  },
  value: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.body_copy,
  },
});

const mapStateToProps = state => {
  return {
    symptoms: state.symptomReducer,
  };
};

export default connect(mapStateToProps)(SymptomsSummary);
