import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {REPORT_BLE_URL} from '../utils/endpoints';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import colors from '../assets/colors';
import CustomIcon from '../assets/icons/CustomIcon.js';
import {connect} from 'react-redux';

class Confirmation extends Component {
  render() {
    const {
      symptoms,
      symptoms: {timeOfDay, ts},
    } = this.props;

    const symptomMap = {
      fever: 'Fever:',
      feverOnsetDate: 'Onset date:',
      feverTemperature: 'Highest temp:',
      feverDays: 'Duration (days):',
      abdominalPain: 'Abdominal pain:',
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
      <ScrollView>
        <Image
          style={styles.hero}
          source={require('../assets/health/symptom_confirmation_bg.png')}
        />
        <View style={styles.header}>
          <Text style={styles.title}>Your Symptom log has been saved</Text>
          <View style={styles.record}>
            <View style={styles.icon_wrapper}>
              <CustomIcon
                name={'usage24'}
                size={20}
                color={colors.primary_theme}
              />
            </View>
            <View>
              <Text style={styles.time_of_day}>{timeOfDay}</Text>
              <Text style={styles.ts}>{new Date(ts).toLocaleString()}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.symptom_header}>SYMPTOMS</Text>
        <View>
          {Object.entries(symptoms).map(([key, val]) => {
            if (val === 1) {
              if (key === 'fever') {
                const {feverOnsetDate, feverTemperature, feverDays} = symptoms;
                return (
                  <View style={styles.symptom_card}>
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
                  <View style={styles.symptom_card}>
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
                  <View style={styles.symptom_card}>
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
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: 104,
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
    textTransform: 'capitalize',
    marginBottom: 20,
  },
  icon_wrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: colors.fill_on,
  },
  record: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time_of_day: {
    fontSize: 16,
    lineHeight: 24,
    color: '#212121',
  },
  ts: {
    fontSize: 14,
    lineHeight: 16,
    color: colors.secondary_body_copy,
  },
  symptom_header: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 18,
    textTransform: 'uppercase',
    color: colors.secondary_body_copy,
    paddingHorizontal: 15,
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
  }
});

const mapStateToProps = state => {
  return {
    symptoms: state.symptomReducer,
  };
};

export default connect(mapStateToProps)(Confirmation);
