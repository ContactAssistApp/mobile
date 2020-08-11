import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import CustomIcon from 'assets/icons/CustomIcon.js';
import colors from 'assets/colors';
import PropTypes from 'prop-types';
import {updateSymptom, clearSymptoms} from './actions.js';
import {bindActionCreators} from 'redux';
import {deleteSymptom} from 'realm/realmSymptomsTasks';
import {connect} from 'react-redux';
import {strings} from 'locales/i18n';
import {connectActionSheet} from '@expo/react-native-action-sheet';

class RecordComp extends Component {
  handleAdd = () => {
    this.props.updateSymptom({
      timeOfDay: this.props.timeOfDay,
    });

    this.props.navigate('SymptomForm');
  };

  handleAction = () => {
    const {
      timeOfDay,
      symptoms: {date},
    } = this.props;
    this.props.showActionSheetWithOptions(
      {
        options: [
          strings('global.cancel'),
          strings('global.edit'),
          strings('global.delete'),
        ],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
      },
      buttonIndex => {
        if (buttonIndex === 1) {
          this.props.updateSymptom({
            timeOfDay,
          });

          this.props.navigate('SymptomForm');
        } else if (buttonIndex === 2) {
          if (timeOfDay === 'AM') {
            this.props.updateSymptom({
              timeOfDay: '',
              amTs: '',
            });
          } else if (timeOfDay === 'PM') {
            this.props.updateSymptom({
              timeOfDay: '',
              pmTs: '',
            });
          }
          this.props.clearSymptoms();
          deleteSymptom(`${date}_${timeOfDay}`);
        }
      },
    );
  };

  render() {
    const {timeOfDay, logTime} = this.props;
    return (
      <>
        <View style={styles.record}>
          <View style={[
            styles.icon_wrapper,
            logTime ? styles.checkmark_wrapper : styles.edit_wrapper,
          ]}>
            {logTime ? (
              <CustomIcon
                name={'checkmark24'}
                size={20}
                color={colors.warning_low}
              />
            ) : (
              <CustomIcon name={'edit24'} size={20} color={colors.gray_icon} />
            )}
          </View>
          <View style={styles.record_detail}>
            <Text style={styles.title}>{timeOfDay}</Text>
            <Text style={styles.time}>
              {logTime
                ? `${strings('saved.text')} ${logTime}`
                : strings('not.logged_text')}
            </Text>
          </View>
          {logTime ? (
            <TouchableOpacity
              style={styles.action_button}
              onPress={this.handleAction}>
              <CustomIcon
                name={'action24'}
                size={20}
                color={colors.gray_icon}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.add_button}
              onPress={this.handleAdd}>
              <CustomIcon name={'add24'} size={16} color={colors.gray_icon} />
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  record: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  icon_wrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkmark_wrapper: {
    backgroundColor: '#DFF6DD',
  },
  edit_wrapper: {
    backgroundColor: colors.fill_off,
  },
  record_detail: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.module_title,
  },
  time: {
    fontSize: 14,
    lineHeight: 16,
    color: colors.secondary_body_copy,
  },
  action_button: {
    paddingLeft: 20,
    paddingRight: 15,
  },
  add_button: {
    paddingLeft: 20,
    paddingRight: 10,
  },
});

RecordComp.propTypes = {
  timeOfDay: PropTypes.string.isRequired,
  logTime: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    symptoms: state.symptomReducer,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateSymptom,
  clearSymptoms,
}, dispatch);

const Record = connectActionSheet(RecordComp)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Record);
