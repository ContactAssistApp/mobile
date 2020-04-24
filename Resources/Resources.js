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
import BottomSheet from 'reanimated-bottom-sheet';

class Resources extends Component {
  renderHeader = () => (
    <Text>
      What is the purpose of this app?
    </Text>
  )

  renderContent = () => (
    <Text>
      CovidSafe is an app that seeks to reduce the spread of coronavirus in the community, specifically by helping people learn if they've been exposed, connecting them to the appropriate public health guidance, and by enabling effective contact tracing. CovidSafe also reduces the burden on public health systems by offering people who have been positively diagnosed and their potential exposures, a safe, private, and fast way to communicate this information to the people who need it — public health authorities and their contact tracing teams.
    </Text>
  )

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
            <View style={styles.container}>
              <BottomSheet
                snapPoints={[450, 300, 0]}
                renderContent={this.renderContent}
                renderHeader={this.renderHeader}
              />
            </View>
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
