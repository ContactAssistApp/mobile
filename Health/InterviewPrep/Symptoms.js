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

class Symptoms extends Component {
  render() {
    return (
      <ScrollView>
        <View style={styles.header}>
          <Image
            style={styles.clipboard}
            source={require('../../assets/health/clipboard.png')}
          />
          <Text style={styles.title}>
            Your public health Agency will be contacting you For an Interview
          </Text>
        </View>
      </ScrollView>
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
    letterSpacing: 0.33,
  },
  upload_trace_button: {
    backgroundColor: colors.primary_theme,
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
  header: {
    fontSize: 20,
    lineHeight: 26,
    textTransform: 'capitalize',
    color: colors.module_title,
    margin: 15,
    marginTop: 25,
  }
});

export default Symptoms;
