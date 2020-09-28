import React, {Component} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import colors from 'assets/colors';
import CustomIcon from 'assets/icons/CustomIcon.js';
import Privacy from 'Privacy/Privacy';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {updatePageIndex} from './actions.js';
import {strings} from 'locales/i18n';

class InterviewPrepIntro extends Component {
  render() {
    const {pageIndex} = this.props.prepData;
    return (
      <ScrollView>
        <Image
          style={styles.hero}
          source={require('assets/health/interview_prep_bg.png')}
        />
        <View style={styles.container}>
          <Text style={styles.section_title}>
            {strings('contact.header_text')}
          </Text>
          <Text style={styles.description}>
            {strings('interview.preparation_description_text')}
          </Text>

          <View>
            <View style={styles.row}>
              <View style={styles.icon_wrapper}>
                <CustomIcon
                  name={'activity24'}
                  color={colors.primary_theme}
                  size={24}
                />
              </View>
              <Text style={styles.detail}>
                {strings('symptoms.experienced_last_14_days')}
              </Text>
            </View>
            <View style={styles.row}>
              <View style={styles.icon_wrapper}>
                <CustomIcon
                  name={'location24'}
                  color={colors.primary_theme}
                  size={24}
                />
              </View>
              <Text style={styles.detail}>
                {strings('location.visited_in_last_14_days')}
              </Text>
            </View>
            <View style={styles.row}>
              <View style={styles.icon_wrapper}>
                <CustomIcon
                  name={'community24'}
                  color={colors.primary_theme}
                  size={24}
                />
              </View>
              <Text style={styles.detail}>
                {strings('people.you_have_been_in_contact_last_14_days')}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.start_button}
            onPress={() => {
              this.props.updatePageIndex({
                field: 'pageIndex',
                value: pageIndex + 1,
              });
            }}>
            <Text style={styles.start_button_text}>
              {strings('get.started_text')}
            </Text>
          </TouchableOpacity>
        </View>
        <Privacy />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: 104,
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  section_title: {
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 26,
    textTransform: 'capitalize',
    color: colors.section_title,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.body_copy,
    marginBottom: 26,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 13,
  },
  icon_wrapper: {
    backgroundColor: colors.fill_on,
    borderRadius: 8,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  detail: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.body_copy,
    flex: 1,
  },
  start_button: {
    marginVertical: 31,
    borderRadius: 8,
    backgroundColor: colors.primary_theme,
    paddingVertical: 15,
    alignItems: 'center',
  },
  start_button_text: {
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: 'white',
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

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updatePageIndex
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InterviewPrepIntro);
