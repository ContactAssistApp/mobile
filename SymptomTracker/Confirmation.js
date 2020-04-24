import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
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
      <>
        <SafeAreaView style={styles.status_bar} />
        <View style={styles.header}>
          <TouchableOpacity onPress={this.props.handleModalClose}>
            <CustomIcon name={'close24'} color={colors.gray_icon} size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Confirmation</Text>
        </View>
        <ScrollView>
          <Image
            style={styles.hero}
            source={require('../assets/health/symptom_confirmation_bg.png')}
          />
          <View style={styles.section_header}>
            <Text style={styles.section_title}>
              Your Symptom log has been saved
            </Text>
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
      </>
    );
  }
}

const styles = StyleSheet.create({
  status_bar: {
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
    alignItems: 'center',
  },
  title: {
    paddingLeft: 20,
    fontSize: 24,
    color: colors.section_title,
    fontWeight: '500',
  },
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
