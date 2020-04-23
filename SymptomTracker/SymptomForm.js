import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import colors from '../assets/colors';
import PropTypes from 'prop-types';
import Accordion from '../views/Accordion';
import Checkbox from '../views/Checkbox';
import Fever from './Fever';
import Cough from './Cough';
import {updateSymptom} from './actions.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {GetStoreData, SetStoreData} from '../utils/asyncStorage';

class SymptomForm extends Component {
  componentDidMount() {
    this.fetchLog();
  }

  fetchLog = async () => {
    const {
      symptoms: {date, timeOfDay},
    } = this.props;
    let log = await GetStoreData(`SYMPTOM_${date}_${timeOfDay}`);
    if (log) {
      log = JSON.parse(log);
      this.props.updateSymptom(log);
    }
  };

  handleCheckboxPress = (id, value) => {
    this.props.updateSymptom({
      [id]: value === 0 ? 1 : 0,
    });
  };

  submitForm = () => {
    let {
      symptoms,
      symptoms: {date, timeOfDay},
    } = this.props;
    const currentTime = new Date().getTime();

    this.props.updateSymptom({
      ts: currentTime,
    });

    symptoms.ts = currentTime;
    SetStoreData(`SYMPTOM_${date}_${timeOfDay}`, symptoms);
    this.props.navigation.navigate('Confirmation');
  };

  render() {
    const {
      symptoms: {
        fever,
        abdominalPain,
        chills,
        cough,
        diarrhea,
        difficultyBreathing,
        headache,
        muscleAches,
        soreThroat,
        vomiting,
        other,
      },
    } = this.props;

    return (
      <ScrollView>
        <Text style={styles.header}>Select Your Symptoms:</Text>
        <View style={styles.symptom_list}>
          <Accordion
            onPress={() => {
              this.handleCheckboxPress('fever', fever);
            }}
            withCheckbox={true}
            checkboxSelected={fever}
            title={'Fever'}
            style={styles.symptom}>
            <Fever />
          </Accordion>
          <View style={styles.symptom}>
            <Checkbox
              onPress={() => {
                this.handleCheckboxPress('abdominalPain', abdominalPain);
              }}
              selected={abdominalPain}
              text={'Abdominal pain'}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              onPress={() => {
                this.handleCheckboxPress('chills', chills);
              }}
              selected={chills}
              text={'Chills'}
            />
          </View>
          <Accordion
            onPress={() => {
              this.handleCheckboxPress('cough', cough);
            }}
            withCheckbox={true}
            checkboxSelected={cough}
            title={'Cough'}
            style={styles.symptom}>
            <Cough />
          </Accordion>
          <View style={styles.symptom}>
            <Checkbox
              onPress={() => {
                this.handleCheckboxPress('diarrhea', diarrhea);
              }}
              selected={diarrhea}
              text={'Diarrhea'}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              onPress={() => {
                this.handleCheckboxPress(
                  'difficultyBreathing',
                  difficultyBreathing
                );
              }}
              selected={difficultyBreathing}
              text={'Difficulty breathing'}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              onPress={() => {
                this.handleCheckboxPress('headache', headache);
              }}
              selected={headache}
              text={'Headache'}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              onPress={() => {
                this.handleCheckboxPress('muscleAches', muscleAches);
              }}
              selected={muscleAches}
              text={'Muscle aches / pains'}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              onPress={() => {
                this.handleCheckboxPress('soreThroat', soreThroat);
              }}
              selected={soreThroat}
              text={'Sore throat'}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              onPress={() => {
                this.handleCheckboxPress('vomiting', vomiting);
              }}
              selected={vomiting}
              text={'Vomiting'}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              onPress={() => {
                this.handleCheckboxPress('other', other);
              }}
              selected={other}
              text={'Other'}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.next_button}
          onPress={this.submitForm}>
          <Text style={styles.next_button_text}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    padding: 15,
    fontSize: 16,
    lineHeight: 23,
    color: colors.module_title,
  },
  symptom_list: {
    backgroundColor: 'white',
  },
  symptom: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomColor: colors.card_border,
    borderBottomWidth: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#141414',
  },
  next_button: {
    marginHorizontal: 20,
    marginVertical: 40,
    borderRadius: 8,
    backgroundColor: colors.primary_theme,
    paddingVertical: 15,
    alignItems: 'center',
  },
  next_button_text: {
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: 'white',
  },
});

SymptomForm.propTypes = {
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
)(SymptomForm);
