import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import colors from '../assets/colors';
import Accordion from '../views/Accordion';

class Resources extends Component {
  render() {
    return (
      <>
        <SafeAreaView style={styles.status_bar} />
        <ScrollView>
          <View style={styles.header}>
            <Image
              style={styles.logo}
              source={require('../assets/home/logo.png')}
            />
            <Text style={styles.title}>Resources</Text>
          </View>
          <View style={styles.faq_container}>
            <Text style={styles.faq_header}>Frequently Asked Questions</Text>
            <Text style={styles.faq_section_header}>About CovidSafe</Text>
            <Accordion
              withCheckbox={false}
              title={'What is the purpose of this app?'}>
              <Text style={styles.faq_content}>
                CovidSafe is an app that seeks to reduce the spread of coronavirus by helping people learn if they've been exposed and take care of themselves if they become ill. CovidSafe also reduces the burden on medical providers by offering people who have been positively diagnosed a safe, private, and fast way to report locations they've visited recently, as well as self-care tips for those well enough to isolate at home.
              </Text>
            </Accordion>
          </View>
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
  faq_container: {
    backgroundColor: 'white',
    height: '100%',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 20,
    marginHorizontal: 10,
  },
  faq_header: {
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: 0.35,
    color: colors.module_title,
  },
  faq_section_header: {
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.408,
    color: colors.section_title,
    paddingVertical: 20,
  },
  faq_content: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    paddingVertical: 20,
  },
});

export default Resources;
