import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View, Image} from 'react-native';
import colors from 'assets/colors';
import CustomIcon from 'assets/icons/CustomIcon.js';
import {connect} from 'react-redux';
import SymptomsSummary from './SymptomsSummary';
import DateConverter from 'utils/date';
import {strings, fmt_date} from 'locales/i18n';

class Confirmation extends Component {
  render() {
    const {
      symptoms: {timeOfDay, amTs, pmTs},
    } = this.props;

    const ts = timeOfDay.toLowerCase() === 'am' ? amTs : pmTs;

    return (
      <ScrollView>
        <Image
          style={styles.hero}
          source={require('../assets/health/symptom_confirmation_bg.png')}
        />
        <View style={styles.section_header}>
          <Text style={styles.section_title}>
            {strings('your.log_have_been_saved_text')}
          </Text>
          <View style={styles.record}>
            <View style={styles.icon_wrapper}>
              <CustomIcon
                name={'confirmation24'}
                size={20}
                color={colors.primary_theme}
              />
            </View>
            <View>
              <Text style={styles.time_of_day}>{timeOfDay}</Text>
              <Text style={styles.ts}>
              {`${fmt_date(new Date(ts), 'LL')} | ${strings('saved.text')} ${DateConverter.timeString(ts)}`}
              </Text>
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
  section_header: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  section_title: {
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
});

const mapStateToProps = state => {
  return {
    symptoms: state.symptomReducer,
  };
};

export default connect(mapStateToProps)(Confirmation);
