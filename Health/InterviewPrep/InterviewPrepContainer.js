import React, {Component} from 'react';
import {SafeAreaView, View, StyleSheet, Dimensions, Text} from 'react-native';
import colors from '../../assets/colors';
import Symptoms from './Symptoms';
import Locations from './Locations';
import People from './People';
import Summary from './Summary';
import StepIndicatorContainer from './StepIndicatorContainer';

class InterviewPrepContainer extends Component {
  constructor() {
    super();
    this.state = {
      index: 0,
    };
  }

  render() {
    return (
      <>
        <SafeAreaView style={styles.status_bar}/>
        <View style={styles.header}>
          <Text style={styles.title}>Interview preparation</Text>
        </View>
        <StepIndicatorContainer index={this.state.index} />
        {this.state.index === 0 && <Symptoms />}
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
  },
  title: {
    fontSize: 24,
    color: colors.section_title,
    fontWeight: '500',
  },
});

export default InterviewPrepContainer;
