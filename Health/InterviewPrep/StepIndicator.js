import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import colors from '../../assets/colors';

class StepIndicator extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.indicator_wrapper}>
          <View style={styles.number_wrapper}>
            <Text style={styles.number}>1</Text>
          </View>
          <Text style={styles.label}>Symptoms</Text>
        </View>
        <View style={styles.indicator_wrapper}>
          <View style={styles.number_wrapper}>
            <Text style={styles.number}>2</Text>
          </View>
          <Text style={styles.label}>Locations</Text>
        </View>
        <View style={styles.indicator_wrapper}>
          <View style={styles.number_wrapper}>
            <Text style={styles.number}>3</Text>
          </View>
          <Text style={styles.label}>People</Text>
        </View>
        <View style={styles.indicator_wrapper}>
          <View style={styles.number_wrapper}>
            <Text style={styles.number}>4</Text>
          </View>
          <Text style={styles.label}>Summary</Text>
        </View>
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
  indicator_wrapper: {
    alignItems: 'center',
  },
  number: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
    textAlign: 'center',
    color: colors.section_title,
  },
  number_wrapper: {
    backgroundColor: colors.card_border,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
    color: colors.gray_icon,
  },
});

export default StepIndicator;
