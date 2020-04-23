import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View, Image} from 'react-native';
import colors from '../assets/colors';
import CustomIcon from '../assets/icons/CustomIcon.js';
import {connect} from 'react-redux';
import SymptomsSummary from './SymptomsSummary';

class Confirmation extends Component {
  render() {
    const {
      symptoms: {timeOfDay, ts},
    } = this.props;

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

        <SymptomsSummary />
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
  },
});

const mapStateToProps = state => {
  return {
    symptoms: state.symptomReducer,
  };
};

export default connect(mapStateToProps)(Confirmation);
