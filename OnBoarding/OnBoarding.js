import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import colors from '../assets/colors';

class OnBoarding extends Component {
  render() {
    const {navigate} = this.props.navigation;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View style={styles.hero}>
            <View style={styles.placeholder} />
            <Text style={styles.header}>CovidSafe</Text>
            <Text style={styles.description}>
              Slowing the spread of COVID-19, together
            </Text>
          </View>

          <View style={styles.start_container}>
            <Text style={styles.intro}>
              Egestas tellus rutrum tellus pellentesque eu tincidunt. Odio tempor orci dapibus ultrices in iaculis nunc sed augue
              suspendisse.
            </Text>
            <TouchableOpacity
              style={styles.start_button}
              onPress={() => navigate('Preferences', {screen: 'Preferences'})}
            >
              <Text style={styles.start_button_text}>Let's get started</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.professional_button}>
              <Text style={styles.professional_button_text}>
                I'm a medical professional
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footer_text}>Brought to you by</Text>
            <View style={styles.logos}>
              <View style={styles.logo}>
                <Text>UW Logo</Text>
              </View>
              <View style={styles.logo}>
                <Text>Msft Logo</Text>
              </View>
            </View>
            <View style={styles.footer_links}>
              <View style={styles.privacy_link}>
                <Text style={styles.privacy_text}>Privacy</Text>
              </View>
              <View style={styles.terms_link}>
                <Text style={styles.term_text}>Terms and Conditions</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  hero: {
    backgroundColor: colors.PURPLE_90,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  placeholder: {
    height: 100,
    backgroundColor: colors.PURPLE_50,
    marginBottom: 30,
  },
  header: {
    color: 'white',
    fontWeight: '500',
    fontSize: 28,
    lineHeight: 33,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    color: 'white',
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
  start_container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  intro: {
    color: colors.GRAY_50,
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 30,
  },
  start_button: {
    width: '100%',
    borderRadius: 2,
    backgroundColor: colors.PURPLE_50,
    paddingVertical: 15,
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  start_button_text: {
    color: 'white',
    fontSize: 14,
    lineHeight: 16,
  },
  professional_button: {
    width: '100%',
    borderRadius: 2,
    backgroundColor: colors.GRAY_40,
    paddingVertical: 15,
    flex: 1,
    alignItems: 'center',
  },
  professional_button_text: {
    color: colors.GRAY_90,
    fontSize: 14,
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  footer_text: {
    color: colors.GRAY_50,
    textAlign: 'center',
  },
  logos: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
  },
  logo: {
    flex: 1,
    backgroundColor: colors.GRAY_40,
    margin: 10,
    padding: 5,
  },
  footer_links: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  privacy_link: {
    paddingRight: 5,
    marginRight: 5,
    borderColor: colors.GRAY_50,
    borderRightWidth: 1,
  },
  privacy_text: {
    color: colors.GRAY_50,
    textDecorationLine: 'underline',
  },
  term_text: {
    color: colors.GRAY_50,
    textDecorationLine: 'underline',
  },
});
export default OnBoarding;
