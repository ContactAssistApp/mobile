import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import colors from '../assets/colors';
import PropTypes from 'prop-types';
import Accordion from '../views/Accordion';
import Checkbox from '../views/Checkbox';
import Fever from './Fever';

class SymptomForm extends Component {
  render() {
    const {} = this.props;
    return (
      <ScrollView>
        <Text style={styles.header}>Select Your Symptoms:</Text>
        <View style={styles.symptom_list}>
          <Accordion title={'Fever'} style={styles.symptom}>
            <Fever />
          </Accordion>
          <View style={styles.symptom}>
            <Checkbox
              selected={false}
              text={'Abdominal pain'}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              selected={true}
              text={'Chills'}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              selected={true}
              text={'Cough'}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              selected={true}
              text={'Diarrhea'}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              selected={true}
              text={'Difficulty breathing'}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              selected={true}
              text={'Headache'}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              selected={true}
              text={'Muscle aches / pains'}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              selected={true}
              text={'Sore throat'}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              selected={true}
              text={'Vomiting'}
            />
          </View>
          <View style={styles.symptom}>
            <Checkbox
              selected={true}
              text={'Other'}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.next_button}
          onPress={() => {}}>
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
  timeOfDay: PropTypes.string.isRequired,
  logTime: PropTypes.string.isRequired,
};

export default SymptomForm;
