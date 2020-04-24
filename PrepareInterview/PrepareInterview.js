import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
} from 'react-native';
import colors from '../assets/colors';
import InterviewPrepIntro from '../InterviewPrep/Intro';

class PrepareInterview extends Component {
  constructor() {
    super();
    this.state = {
      modalOn: false,
    };
  }

  closeModal = () => {
    this.setState({
      modalOn: false,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Modal presentationStyle="pageSheet" visible={this.state.modalOn}>
          <InterviewPrepIntro handleModalClose={this.closeModal} />
        </Modal>
        <View style={styles.header}>
          <Image
            style={styles.clipboard}
            source={require('../assets/health/clipboard.png')}
          />
          <Text style={styles.title}>
            Your public health Agency will be contacting you For an Interview
          </Text>
        </View>
        <Text style={styles.description}>
          During your interview, a healthcare nurse will be collecting a list of critical information to help identify those around you who may have been exposed.
        </Text>
        <View style={styles.button_group}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.setState({
                modalOn: true,
              });
            }}>
            <Text style={styles.button_text}>prepare for your interview</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.learn_more]}
            onPress={() => {

            }}>
            <Text style={[styles.button_text, styles.learn_more_text]}>Learn more</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clipboard: {
    width: 60,
    height: 70,
  },
  title: {
    fontSize: 16,
    lineHeight: 23,
    textTransform: 'capitalize',
    color: colors.module_title,
    paddingLeft: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.body_copy,
    marginVertical: 15,
  },
  button: {
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.primary_theme,
    paddingVertical: 15,
    alignItems: 'center',
  },
  button_text: {
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: 'white',
    textTransform: 'uppercase',
  },
  learn_more: {
    backgroundColor: colors.card_border,
  },
  learn_more_text: {
    color: colors.section_title,
  },
});

export default PrepareInterview;
