import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import colors from 'assets/colors';
import PropTypes from 'prop-types';
import Accordion from 'views/Accordion';
import Checkbox from 'views/Checkbox';
import Fever from './Fever';
import Cough from './Cough';
import {updateSymptom, clearSymptoms} from './actions.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Confirmation from './Confirmation';
import Modal from 'views/Modal';
import {addSymptoms} from 'realm/realmSymptomsTasks';
import DateConverter from 'utils/date';
import {getSymptoms} from 'realm/realmSymptomsTasks';
import {strings} from 'locales/i18n';

class SymptomForm extends Component {
  constructor() {
    super();
    this.state = {
      modalOn: false,
    };
  }

  componentDidMount() {
    this.fetchLog();
  }

  closeModal = () => {
    this.setState({
      modalOn: false,
    });
    this.props.clearSymptoms();
    this.props.navigation.navigate('BottomNav');
  };

  fetchLog = async () => {
    const {
      symptoms: {date, timeOfDay},
    } = this.props;

    const logs = await getSymptoms(DateConverter.calendarToDate(date));
    const log = logs.filter(item => item.timeOfDay === timeOfDay)[0];

    if (log) {
      let logObj = JSON.parse(JSON.stringify(log));
      logObj.date = DateConverter.calendarFormat(new Date(logObj.date));
      this.props.updateSymptom(logObj);
    }
  };

  handleCheckboxPress = (id, value) => {
    this.props.updateSymptom({
      [id]: value === 0 ? 1 : 0,
    });
  };

  submitForm = async () => {
    let {
      symptoms,
      symptoms: {date, timeOfDay},
    } = this.props;
    const currentTime = new Date().getTime();

    if (timeOfDay.toLowerCase() === 'am') {
      this.props.updateSymptom({
        amTs: currentTime,
      });
    } else {
      this.props.updateSymptom({
        pmTs: currentTime,
      });
    }

    delete symptoms.amTs;
    delete symptoms.pmTs;

    symptoms.ts = currentTime;
    symptoms.dateTime = `${date}_${timeOfDay}`;
    symptoms.date = DateConverter.calendarToDate(date);
    await addSymptoms(symptoms);

    this.setState({
      modalOn: true,
    });
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
        <Modal
          visible={this.state.modalOn}
          handleModalClose={this.closeModal}
          title={'Confirmation'}>
          <Confirmation />
        </Modal>

        <Text style={styles.header}>{strings('symptoms.text')}:</Text>
        <View style={styles.symptom_list}>
          <Accordion
            onPress={() => {
              this.handleCheckboxPress('fever', fever);
            }}
            withCheckbox={true}
            checkboxSelected={fever}
            title={strings('fever.txt')}
            style={styles.symptom}>
            <Fever />
          </Accordion>
          <View style={styles.symptom}>
            <Checkbox
              onPress={() => {
                this.handleCheckboxPress('abdominalPain', abdominalPain);
              }}
              selected={abdominalPain}
              text={strings('abdominal.pain_txt')}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              onPress={() => {
                this.handleCheckboxPress('chills', chills);
              }}
              selected={chills}
              text={strings('chills.txt')}
            />
          </View>
          <Accordion
            onPress={() => {
              this.handleCheckboxPress('cough', cough);
            }}
            withCheckbox={true}
            checkboxSelected={cough}
            title={strings('cough.txt')}
            style={styles.symptom}>
            <Cough />
          </Accordion>
          <View style={styles.symptom}>
            <Checkbox
              onPress={() => {
                this.handleCheckboxPress('diarrhea', diarrhea);
              }}
              selected={diarrhea}
              text={strings('diarrhea.txt')}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              onPress={() => {
                this.handleCheckboxPress(
                  'difficultyBreathing',
                  difficultyBreathing,
                );
              }}
              selected={difficultyBreathing}
              text={strings('difficult.in_breathing')}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              onPress={() => {
                this.handleCheckboxPress('headache', headache);
              }}
              selected={headache}
              text={strings('headache.txt')}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              onPress={() => {
                this.handleCheckboxPress('muscleAches', muscleAches);
              }}
              selected={muscleAches}
              text={strings('ab.pain_desc')}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              onPress={() => {
                this.handleCheckboxPress('soreThroat', soreThroat);
              }}
              selected={soreThroat}
              text={strings('sore.throat_txt')}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              onPress={() => {
                this.handleCheckboxPress('vomiting', vomiting);
              }}
              selected={vomiting}
              text={strings('vomiting.txt')}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.next_button} onPress={this.submitForm}>
          <Text style={styles.next_button_text}>{strings('save.text')}</Text>
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
  clearSymptoms: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    symptoms: state.symptomReducer,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateSymptom,
  clearSymptoms,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SymptomForm);
