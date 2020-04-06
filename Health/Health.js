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
      <SafeAreaView>
        <View style={styles.header}>
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
            Your report will be anonymous and your {'\n'} identity will be protected.
          </Text>
          <TouchableOpacity
            style={styles.new_report_button}
            onPress={() => {
              navigate('Report')
            }}>
            <Icon name="plus" color={'white'} size={20} />
            <Text style={styles.new_report_text}>
              New Report
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.PURPLE_50,
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    color: 'white',
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
    fontSize: 20,
    lineHeight: 26,
    textAlign: 'center',
    paddingVertical: 10,
  },
  reporting_description: {
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    color: colors.GRAY_50,
    paddingVertical: 10,
  },
  new_report_button: {
    backgroundColor: colors.PURPLE_50,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
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
