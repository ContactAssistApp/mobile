import React, {Component} from 'react';
import {StyleSheet, Text, TextInput} from 'react-native';
import colors from 'assets/colors';
import PropTypes from 'prop-types';
import {updateSymptom} from './actions.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {strings} from 'locales/i18n';

class Fever extends Component {
  handleEdit = (id, value) => {
    this.props.updateSymptom({
      [id]: value,
    });
  };

  render() {
    const {
      symptoms: {feverOnsetDate, feverTemperature, feverDays},
    } = this.props;

    return (
      <>
        <Text style={styles.label}>{strings('card.onset_date_hint')}:</Text>
        <TextInput
          style={styles.inputbox}
          keyboardType={'default'}
          onChangeText={text => {
            this.handleEdit('feverOnsetDate', text);
          }}
          value={feverOnsetDate}
        />
        <Text style={styles.label}>{strings('highest.temperature_text')}:</Text>
        <TextInput
          style={styles.inputbox}
          keyboardType={'decimal-pad'}
          onChangeText={text => {
            this.handleEdit('feverTemperature', parseFloat(text));
          }}
          value={feverTemperature}
          maxLength={5}
        />
        <Text style={styles.label}>
          {strings('card.onset_days_experienced')}:
        </Text>
        <TextInput
          style={styles.inputbox}
          keyboardType={'numeric'}
          onChangeText={text => {
            this.handleEdit('feverDays', parseInt(text));
          }}
          value={feverDays}
          maxLength={2}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    lineHeight: 15,
    textTransform: 'capitalize',
    color: colors.gray_icon,
    marginBottom: 8,
  },
  inputbox: {
    marginBottom: 15,
    height: 40,
    width: 200,
    borderBottomColor: colors.primary_theme,
    borderBottomWidth: 1,
    backgroundColor: colors.card_border,
  },
});

Fever.propTypes = {
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
)(Fever);
