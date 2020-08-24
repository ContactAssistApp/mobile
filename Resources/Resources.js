import React, {Component} from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import data from './faq.json';
import colors from 'assets/colors';
import Question from './Question';
import ResourcesComponent from 'ResourcesComponent/ResourcesComponent';
import {strings} from 'locales/i18n';
import Header from 'views/Header';

class Resources extends Component {
  constructor() {
    super();
    this.state = {
      selectedQ: '',
      selectedA: '',
    };
  }
  render() {
    return (
      <>
        <SafeAreaView style={styles.status_bar} />
        <ScrollView>
          <View style={styles.header}>
            <Header title={strings('bottom.sheet_menu_item_resources')} />
          </View>
          <View style={styles.faq_container}>
            <Text style={styles.faq_header}>
              {strings('frequently.asked_questions')}
            </Text>
            <Text style={styles.faq_section_header}>
              {strings('about.covidsafe')}
            </Text>
            {data.faqs.map(faq => {
              return (
                <Question
                  key={faq.a}
                  question={strings(faq.q)}
                  handleOnPress={() => {
                    this.Scrollable.open();
                    this.setState({
                      selectedQ: strings(faq.q),
                      selectedA: strings(faq.a),
                    });
                  }}
                />
              );
            })}
          </View>
          <ResourcesComponent />
        </ScrollView>
        <RBSheet
          ref={ref => {
            this.Scrollable = ref;
          }}
          closeOnDragDown
          customStyles={{
            container: {
              borderTopLeftRadius: 14,
              borderTopRightRadius: 14,
              height: 360,
            },
          }}>
          <ScrollView>
            <TouchableOpacity style={styles.sheet_container}>
              <View style={styles.question_container}>
                <Text style={styles.question}>{this.state.selectedQ}</Text>
              </View>
              <Text style={styles.answer}>{this.state.selectedA}</Text>
            </TouchableOpacity>
          </ScrollView>
        </RBSheet>
      </>
    );
  }
}

const styles = StyleSheet.create({
  status_bar: {
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  faq_container: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  faq_header: {
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: 0.35,
    color: colors.module_title,
    paddingBottom: 12,
  },
  faq_section_header: {
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.408,
    color: colors.section_title,
    paddingVertical: 12,
  },
  faq_content: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    paddingVertical: 20,
  },
  question_container: {
    paddingTop: 28,
    paddingHorizontal: 29,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
  },
  question: {
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
    letterSpacing: -0.24,
    color: colors.secondary_body_copy,
  },
  answer: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: '#141414',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 66,
  },
});

export default Resources;
