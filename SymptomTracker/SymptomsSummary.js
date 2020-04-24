import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../assets/colors';
import {connect} from 'react-redux';

class SymptomsSummary extends Component {
  render() {
    const {symptoms} = this.props;
    const symptomMap = {
      fever: 'Fever:',
      feverOnsetDate: 'Onset date:',
      feverTemperature: 'Highest temp:',
      feverDays: 'Duration (days):',
      abdominalPain: 'Abdominal pain',
      chills: 'Chills',
      cough: 'Cough',
      coughOnsetDate: 'Onset date:',
      coughDays: 'Duration (days):',
      coughSeverity: 'Severity:',
      diarrhea: 'Diarrhea',
      difficultyBreathing: 'Difficulty breathing',
      headache: 'Headache',
      muscleAches: 'Muscle aches / pain',
      soreThroat: 'Sore throat',
      vomiting: 'Vomiting',
      other: 'Other',
    };

    return (
      <>
        <Text style={styles.symptom_header}>SYMPTOMS</Text>
        <View>
          {Object.entries(symptoms).map(([key, val]) => {
            if (val === 1) {
              if (key === 'fever') {
                const {feverOnsetDate, feverTemperature, feverDays} = symptoms;
                return (
                  <View style={styles.symptom_card} key={key}>
                    <Text style={styles.symptom_name}>{symptomMap[key]}</Text>
                    {feverOnsetDate && (
                      <View style={styles.row}>
                        <Text style={styles.label}>
                          {symptomMap.feverOnsetDate}
                        </Text>
                        <Text style={styles.value}>
                          {symptoms.feverOnsetDate}
                        </Text>
                      </View>
                    )}
                    {feverTemperature && (
                      <View style={styles.row}>
                        <Text style={styles.label}>
                          {symptomMap.feverTemperature}
                        </Text>
                        <Text style={styles.value}>
                          {symptoms.feverTemperature}
                        </Text>
                      </View>
                    )}
                    {feverDays && (
                      <View style={styles.row}>
                        <Text style={styles.label}>{symptomMap.feverDays}</Text>
                        <Text style={styles.value}>{symptoms.feverDays}</Text>
                      </View>
                    )}
                  </View>
                );
              } else if (key === 'cough') {
                const {coughOnsetDate, coughDays, coughSeverity} = symptoms;
                let coughSeverityString = '';
                if (coughSeverity === 1) {
                  coughSeverityString = 'Mild';
                } else if (coughSeverity === 2) {
                  coughSeverityString = 'Moderate';
                } else if (coughSeverity === 3) {
                  coughSeverityString = 'Severe';
                }
                return (
                  <View style={styles.symptom_card} key={key}>
                    <Text style={styles.symptom_name}>{symptomMap[key]}</Text>
                    {coughOnsetDate && (
                      <View style={styles.row}>
                        <Text style={styles.label}>
                          {symptomMap.coughOnsetDate}
                        </Text>
                        <Text style={styles.value}>
                          {symptoms.coughOnsetDate}
                        </Text>
                      </View>
                    )}
                    {coughDays && (
                      <View style={styles.row}>
                        <Text style={styles.label}>{symptomMap.coughDays}</Text>
                        <Text style={styles.value}>{symptoms.coughDays}</Text>
                      </View>
                    )}
                    {coughSeverity > 0 && (
                      <View style={styles.row}>
                        <Text style={styles.label}>
                          {symptomMap.coughSeverity}
                        </Text>
                        <Text style={styles.value}>{coughSeverityString}</Text>
                      </View>
                    )}
                  </View>
                );
              } else {
                return (
                  <View style={styles.symptom_card} key={key}>
                    <Text style={styles.symptom_name}>{symptomMap[key]}</Text>
                  </View>
                );
              }
            }
          })}
        </View>

        <View style={styles.privacy_container}>
          <Text style={styles.privacy_text}>
            This information is stored in the app on your phone and remains private to you.
          </Text>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
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
  privacy_container: {
    borderRadius: 8,
    backgroundColor: colors.fill_off,
    marginHorizontal: 25,
    marginTop: 25,
    marginBottom: 40,
    padding: 20,
  },
});

const mapStateToProps = state => {
  return {
    symptoms: state.symptomReducer,
  };
};

export default connect(mapStateToProps)(SymptomsSummary);
