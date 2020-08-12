import React, {Component} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
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

class InterviewPrepContainer extends Component {
  constructor() {
    super();
    this.state = {
      index: 0,
    };
  }

  render() {
    const {pageIndex} = this.props.prepData;

    return (
      <ScrollView>
        <StepIndicatorContainer index={this.state.index} />
        {
          {
            0: <Symptoms />,
            1: <Locations />,
            2: <People />,
            3: <Summary />,
          }[this.state.index]
        }
        <View style={styles.button_group}>
          {this.state.index < 3 && (
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
          {this.state.index === 3 && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.props.handleModalClose();
              }}>
              <Text style={styles.button_text}>{strings('save.text')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, styles.previous]}
            onPress={() => {
              if (this.state.index > 0) {
                this.setState({
                  index: this.state.index - 1,
                });
              } else {
                this.props.updatePageIndex({
                  field: 'pageIndex',
                  value: pageIndex - 1,
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
    paddingLeft: 20,
    fontSize: 24,
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
