import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../assets/colors';
import PropTypes from 'prop-types';
import {updateSymptom} from './actions.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class Cough extends Component {
  handleEdit = (id, value) => {
    this.props.updateSymptom({
      field: id,
      value,
    });
  };

  selectSeverity = value => {
    const {
      symptoms: {coughSeverity},
    } = this.props;

    if (value === coughSeverity) {
      value = 0;
    }

    this.props.updateSymptom({
      field: 'coughSeverity',
      value,
    });
  };

  render() {
    const {
      symptoms: {coughOnsetDate, coughDays, coughSeverity},
    } = this.props;

    return (
      <>
        <Text style={styles.label}>Onset Date:</Text>
        <TextInput
          style={styles.inputbox}
          keyboardType={'default'}
          onChangeText={text => {
            this.handleEdit('coughOnsetDate', text);
          }}
          value={coughOnsetDate}
        />
        <Text style={styles.label}>Days Experienced:</Text>
        <TextInput
          style={styles.inputbox}
          keyboardType={'numeric'}
          onChangeText={text => {
            this.handleEdit('coughDays', text);
          }}
          value={coughDays}
          maxLength={2}
        />
        <View>
          <View style={styles.severity_buttons}>
            <TouchableOpacity
              style={[
                styles.severity_button,
                coughSeverity === 1 ? styles.mild_selected : '',
              ]}
              onPress={() => {
                this.selectSeverity(1);
              }}>
              <Text style={styles.button_text}>Mild</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.severity_button,
                coughSeverity === 2 ? styles.moderate_selected : '',
              ]}
              onPress={() => {
                this.selectSeverity(2);
              }}>
              <Text style={styles.button_text}>Moderate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.severity_button,
                coughSeverity === 3 ? styles.severe_selected : '',
              ]}
              onPress={() => {
                this.selectSeverity(3);
              }}>
              <Text style={styles.button_text}>Severe</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  severity_buttons: {
    flexDirection: 'row',
  },
  severity_button: {
    backgroundColor: colors.fill_off,
    marginRight: 8,
    marginBottom: 15,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  button_text: {
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    color: colors.body_copy,
  },
  mild_selected: {
    backgroundColor: '#DFF6DD',
  },
  moderate_selected: {
    backgroundColor: '#FFF2C8',
  },
  severe_selected: {
    backgroundColor: colors.warning_high,
  },
});

Cough.propTypes = {
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
)(Cough);
