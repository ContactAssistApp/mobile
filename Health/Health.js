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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../assets/colors';

class Health extends Component {
  render() {
    const {navigate} = this.props.navigation;

    return (
      <>
        <SafeAreaView style={styles.status_bar} />
        <SafeAreaView>
          <View style={styles.header}>
            <Image
              style={styles.logo}
              source={require('../assets/home/logo.png')}
            />
            <Text style={styles.title}>Health Report</Text>
          </View>
          <View style={styles.reporting_container}>
            <Image
              style={styles.reporting_logo}
              source={require('../assets/health/report.png')}
            />
            <Text style={styles.reporting_title}>
              Help your community by {'\n'} reporting your diagnosis
            </Text>
            <Text style={styles.reporting_description}>
              Your report will be anonymous and{'\n'} your identity will be protected.
            </Text>
            <TouchableOpacity
              style={styles.new_report_button}
              onPress={() => {
                navigate('Report');
              }}>
              <Icon name="plus" color={'white'} size={20} />
              <Text style={styles.new_report_text}>New Report</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
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
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  title: {
    fontSize: 24,
    color: colors.section_title,
    fontWeight: '500',
  },
  reporting_container: {
    backgroundColor: 'white',
    height: '100%',
    alignItems: 'center',
  },
  reporting_logo: {
    width: 180,
    height: 180,
    marginTop: 80,
  },
  reporting_title: {
    paddingVertical: 20,
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 22,
    textAlign: 'center',
    letterSpacing: -0.408,
  },
  reporting_description: {
    color: colors.secondary_body_copy,
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
    letterSpacing: -0.24,
  },
  new_report_button: {
    backgroundColor: colors.primary_theme,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    top: 50,
  },
  new_report_text: {
    color: 'white',
    fontSize: 15,
    lineHeight: 20,
    paddingLeft: 5,
  },
});

export default Health;
