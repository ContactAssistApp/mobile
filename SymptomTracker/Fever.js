import React, {Component} from 'react';
import {StyleSheet, Text, TextInput} from 'react-native';
import colors from '../assets/colors';
import PropTypes from 'prop-types';
import {updateSymptom} from './actions.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class Fever extends Component {
  handleEdit = (id, value) => {
    this.props.updateSymptom({
      [id]: value,
    });
  };

  render() {
    const {
      symptoms: {
        feverOnsetDate,
        feverTemperature,
        feverDays,
      },
    } = this.props;

    return (
      <>
        <Text style={styles.label}>Onset Date:</Text>
        <TextInput
          style={styles.inputbox}
          keyboardType={'default'}
          onChangeText={text => {
            this.handleEdit('feverOnsetDate', text);
          }}
          value={feverOnsetDate}
        />
        <Text style={styles.label}>Highest Temperature:</Text>
        <TextInput
          style={styles.inputbox}
          keyboardType={'numeric'}
          onChangeText={text => {
            this.handleEdit('feverTemperature', text);
          }}
          value={feverTemperature}
          maxLength={3}
        />
        <Text style={styles.label}>Days Experienced:</Text>
        <TextInput
          style={styles.inputbox}
          keyboardType={'numeric'}
          onChangeText={text => {
            this.handleEdit('feverDays', text);
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
