import React, {PureComponent} from 'react';
import {ScrollView, StyleSheet, Image} from 'react-native';
import colors from '../assets/colors';
import PrepareInterviewComponent from '../InterviewPrep/PrepareInterviewComponent';
import Emergency from '../Privacy/Emergency';
import CareTips from '../CareTips/CareTips';
import ResourcesComponent from '../ResourcesComponent/ResourcesComponent';

class Report extends PureComponent {
  render() {
    return (
      <ScrollView>
        <Image
          style={styles.hero}
          source={require('../assets/health/report_bg.png')}
        />
        <PrepareInterviewComponent />
        <Emergency />
        <CareTips />
        <ResourcesComponent />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: 104,
  },
  result_container: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 26,
    lineHeight: 31,
    letterSpacing: 0.33,
  },
  button: {
    backgroundColor: colors.primary_theme,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  learn_more: {
    backgroundColor: 'white',
    borderColor: colors.card_border,
    borderWidth: 1,
  },
  button_text: {
    color: 'white',
    fontSize: 15,
    lineHeight: 20,
  },
  learn_more_text: {
    color: colors.primary_theme,
  },
  header: {
    fontSize: 20,
    lineHeight: 26,
    textTransform: 'capitalize',
    color: colors.module_title,
    margin: 15,
    marginTop: 25,
  },
});

export default Report;
