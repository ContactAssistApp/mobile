import React, {Component} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import colors from 'assets/colors';
import Symptoms from './Symptoms';
import Locations from './Locations';
import People from './People';
import Summary from './Summary';
import StepIndicatorContainer from './StepIndicatorContainer';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {updatePageIndex} from './actions.js';
import {strings} from 'locales/i18n';
import Popup from 'views/Popup';
import Input from 'views/Input';
import {addSummary} from 'realm/realmInterviewSummaryTasks';
import DateConverter from 'utils/date';

class InterviewPrepContainer extends Component {
  constructor() {
    super();
    this.state = {
      index: 0,
      savePopupOn: false,
      enableContinue: false,
      confirmText: '',
    };
  }

  handleCallback = (field, _, val) => {
    if (val.toLowerCase() === 'i confirm') {
      this.setState({
        enableContinue: true,
      });
    } else {
      this.setState({
        enableContinue: false,
      });
    }
  };

  render() {
    const {pageIndex} = this.props.prepData;
    const {enableContinue, index} = this.state;
    return (
      <ScrollView>
        <Popup
          visible={this.state.savePopupOn}
          handleModalClose={this.handleModalClose}>
          <KeyboardAvoidingView
            style={styles.save_form_container}
            behavior={'padding'}>
            <Text style={styles.title}>
              {strings('interview_prep_save_consent_form.title')}
            </Text>
            <Text style={styles.description}>
              {strings('interview_prep_save_consent_form.description')}
            </Text>
            <Text style={styles.confirm_label}>
              {strings('interview_prep_save_consent_form.confirm_label')}
            </Text>
            <View style={styles.confirm_box}>
              <Input
                name={''}
                value={this.state.confirmText}
                field={'confirm_box'}
                handleCallback={this.handleCallback}
                customStyle={
                  this.state.enableContinue
                    ? [styles.confirm_input, styles.active_confirm_input]
                    : styles.confirm_input
                }
              />
            </View>
            <TouchableOpacity
              style={[styles.consent_form_btn, styles.continue_btn]}
              disabled={!enableContinue}
              onPress={() => {
                addSummary(DateConverter.getUTCUnixTime());
                this.setState({savePopupOn: false}, () => {
                  this.props.updatePageIndex({
                    field: 'pageIndex',
                    value: pageIndex + 1,
                  });
                });
              }}>
              <Text
                style={
                  enableContinue
                    ? [styles.consent_form_btn_text, styles.active]
                    : [styles.consent_form_btn_text, styles.disabled]
                }>
                {strings('interview_prep_save_consent_form.continue_btn')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.consent_form_btn}
              onPress={() => {
                this.setState({
                  savePopupOn: false,
                });
              }}>
              <Text style={styles.consent_form_btn_text}>
                {strings('interview_prep_save_consent_form.no_thanks_btn')}
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Popup>
        {index <= 3 && <StepIndicatorContainer index={index} />}
        {
          {
            0: <Symptoms />,
            1: <Locations />,
            2: <People />,
            3: <Summary />,
          }[index]
        }
        <View style={styles.button_group}>
          {index < 3 && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.setState({
                  index: this.state.index + 1,
                });
              }}>
              <Text style={styles.button_text}>{strings('next.btn_text')}</Text>
            </TouchableOpacity>
          )}
          {index === 3 && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.setState({savePopupOn: true});
              }}>
              <Text style={styles.button_text}>{strings('save.text')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, styles.previous]}
            onPress={() => {
              if (index === 0) {
                this.props.updatePageIndex({
                  field: 'pageIndex',
                  value: pageIndex - 1,
                });
              } else if (index > 0 && index <= 3) {
                this.setState({
                  index: index - 1,
                });
              }
            }}>
            <Text style={[styles.button_text, styles.previous_text]}>
              {strings('previous.btn_text')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
    alignItems: 'center',
  },
  title: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    fontSize: 20,
    lineHeight: 28,
    color: colors.section_title,
    fontWeight: '500',
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
  button_group: {
    padding: 20,
  },
  previous: {
    backgroundColor: colors.card_border,
  },
  previous_text: {
    color: colors.section_title,
  },
  save_form_container: {
    backgroundColor: 'white',
    borderRadius: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 24,
  },
  confirm_label: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  confirm_box: {
    marginHorizontal: 24,
    paddingTop: 13,
    paddingBottom: 30,
  },
  consent_form_btn: {
    paddingVertical: 19,
    alignItems: 'center',
  },
  consent_form_btn_text: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: 'capitalize',
  },
  continue_btn: {
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
    borderTopWidth: 1,
    borderTopColor: colors.card_border,
  },
  confirm_input: {
    backgroundColor: colors.fill_off,
    borderBottomColor: colors.gray_icon,
  },
  active_confirm_input: {
    borderBottomColor: colors.primary_theme,
  },
  active: {
    color: colors.primary_theme,
  },
  disabled: {
    color: '#ACACAC',
  },
});

InterviewPrepContainer.propTypes = {
  updatePageIndex: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    prepData: state.interviewPrepReducer,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updatePageIndex
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InterviewPrepContainer);
