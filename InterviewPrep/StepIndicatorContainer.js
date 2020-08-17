import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import colors from '../assets/colors';
import StepIndicator from './StepIndicator';
import {strings} from '../locales/i18n';

class StepIndicatorContainer extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StepIndicator
          number={1}
          label={strings('symptoms.text')}
          selected={this.props.index === 0}
        />
        <StepIndicator
          number={2}
          label={strings('locations.text')}
          selected={this.props.index === 1}
        />
        <StepIndicator
          number={3}
          label={strings('people.text')}
          selected={this.props.index === 2}
        />
        <StepIndicator
          number={4}
          label={strings('summary.text')}
          selected={this.props.index === 3}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
  },
});

export default StepIndicatorContainer;
