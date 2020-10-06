import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from 'assets/colors';
import {SYMPTOM_MAP} from 'utils/symptoms';
import {strings} from 'locales/i18n';

class SymptomsHalfDay extends Component {
  render() {
    const {symptoms} = this.props;

    return (
      <View style={styles.container}>
        {Object.entries(symptoms).map(([key, val]) => {
          if (val === 1) {
            if (key === 'fever') {
              const {feverOnsetDate, feverTemperature, feverDays} = symptoms;
              return (
                <View style={styles.symptom_card} key={key}>
                  <Text style={styles.symptom_name}>{SYMPTOM_MAP[key]}</Text>
                  {feverOnsetDate !== '' && (
                    <View style={styles.row}>
                      <Text style={styles.label}>
                        {SYMPTOM_MAP.feverOnsetDate}
                      </Text>
                      <Text style={styles.value}>
                        {symptoms.feverOnsetDate}
                      </Text>
                    </View>
                  )}
                  {feverTemperature !== '' && (
                    <View style={styles.row}>
                      <Text style={styles.label}>
                        {SYMPTOM_MAP.feverTemperature}
                      </Text>
                      <Text style={styles.value}>
                        {symptoms.feverTemperature}
                      </Text>
                    </View>
                  )}
                  {feverDays !== '' && (
                    <View style={styles.row}>
                      <Text style={styles.label}>{SYMPTOM_MAP.feverDays}</Text>
                      <Text style={styles.value}>{symptoms.feverDays}</Text>
                    </View>
                  )}
                </View>
              );
            } else if (key === 'cough') {
              const {coughOnsetDate, coughDays, coughSeverity} = symptoms;
              let coughSeverityString = '';
              if (coughSeverity === 1) {
                coughSeverityString = strings('card.symptom_severity_mild');
              } else if (coughSeverity === 2) {
                coughSeverityString = strings('card.symptom_severity_moderate');
              } else if (coughSeverity === 3) {
                coughSeverityString = strings('card.symptom_severity_severe');
              }
              return (
                <View style={styles.symptom_card} key={key}>
                  <Text style={styles.symptom_name}>{SYMPTOM_MAP[key]}</Text>
                  {coughOnsetDate !== '' && (
                    <View style={styles.row}>
                      <Text style={styles.label}>
                        {SYMPTOM_MAP.coughOnsetDate}
                      </Text>
                      <Text style={styles.value}>
                        {symptoms.coughOnsetDate}
                      </Text>
                    </View>
                  )}
                  {coughDays !== '' && (
                    <View style={styles.row}>
                      <Text style={styles.label}>{SYMPTOM_MAP.coughDays}</Text>
                      <Text style={styles.value}>{symptoms.coughDays}</Text>
                    </View>
                  )}
                  {coughSeverity > 0 && (
                    <View style={styles.row}>
                      <Text style={styles.label}>
                        {SYMPTOM_MAP.coughSeverity}
                      </Text>
                      <Text style={styles.value}>{coughSeverityString}</Text>
                    </View>
                  )}
                </View>
              );
            } else if (!key.startsWith('cough') && !key.startsWith('fever')) {
              return (
                <View style={styles.symptom_card} key={key}>
                  <Text style={styles.symptom_name}>{SYMPTOM_MAP[key]}</Text>
                </View>
              );
            }
          }
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  symptom_card: {
    backgroundColor: 'white',
    paddingHorizontal: 19,
    paddingVertical: 15,
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

export default SymptomsHalfDay;
