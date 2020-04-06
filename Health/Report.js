import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import colors from '../assets/colors';

class Report extends Component {
  render() {
    return (
      <SafeAreaView>
        <Image
          style={styles.reporting_logo}
          source={require('../assets/health/report_bg.png')}
        />
        <View style={styles.result_container}>
          <Text style={styles.title}>
            Positive COVID-19 diagnosis confirmed
          </Text>
          <TouchableOpacity
            style={styles.upload_trace_button}
            onPress={() => {}}
          >
            <Text style={styles.upload_trace_button_text}>
              Upload Trace Data
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  result_container: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 26,
    lineHeight: 31,
  },
  upload_trace_button: {
    backgroundColor: colors.PURPLE_50,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  upload_trace_button_text: {
    color: 'white',
    fontSize: 15,
    lineHeight: 20,
  },
});

export default Report;
