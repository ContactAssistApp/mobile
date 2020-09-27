import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../assets/colors';
import InterviewPrepIntro from './Intro';
import Complete from './Complete';
import InterviewPrepContainer from './Container';
import Modal from 'views/Modal';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {strings} from 'locales/i18n';
import CustomIcon from 'assets/icons/CustomIcon.js';

class PrepareInterviewComponent extends Component {
  constructor() {
    super();
    this.state = {
      modalOn: false,
    };
  }

  handleModalClose = () => {
    this.setState({
      modalOn: false,
    });
  };

  render() {
    const {pageIndex} = this.props.prepData;
    return (
      <View style={styles.container}>
        <Modal
          visible={this.state.modalOn}
          handleModalClose={this.handleModalClose}
          title={strings('contact.header_text_demo')}>
          {
            {
              0: <InterviewPrepIntro />,
              1: <InterviewPrepContainer
                  handleModalClose={this.handleModalClose}
                />,
              2: <Complete />,
            }[pageIndex]
          }
        </Modal>
        <View style={styles.header}>
          <CustomIcon name={'chat24'} color={'#E6BE30'} size={24} />
          <Text style={styles.title}>{strings('interview_prep.title')}</Text>
        </View>
        <Text style={styles.description}>
          {strings('interview_prep.description')}
        </Text>
        <View style={styles.button_group}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.setState({
                modalOn: true,
              });
            }}>
            <Text style={styles.button_text}>
              {strings('interview_prep.prepare_btn')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.learn_more]}
            onPress={() => {

            }}>
            <Text style={[styles.button_text, styles.learn_more_text]}>{strings('learn.more_link_text')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    paddingLeft: 10,
    flex: 1,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
    color: '#141414',
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
    textTransform: 'capitalize',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 18,
    color: 'white',
  },
  learn_more: {
    backgroundColor: colors.card_border,
  },
  learn_more_text: {
    color: '#212121',
  },
});

InterviewPrepIntro.propTypes = {
  updatePageIndex: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    prepData: state.interviewPrepReducer,
  };
};

export default connect(mapStateToProps)(PrepareInterviewComponent);
