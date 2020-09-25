import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {connectActionSheet} from '@expo/react-native-action-sheet';
import {deleteLocation} from 'realm/realmLocationTasks';
import {strings} from 'locales/i18n';
import {updateLocationData} from './actions.js';
import CustomIcon from 'assets/icons/CustomIcon.js';
import PropTypes from 'prop-types';
import colors from 'assets/colors';

class Actions extends Component {
  handleAction = () => {
    const {time} = this.props;

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
          this.props.updateLocationData({
            selectedTime: time,
            openLocationModal: true,
          });
        } else if (buttonIndex === 2) {
          if (time) {
            deleteLocation(time);
          }
          this.props.refreshLocations();
        }
      },
    );
  };

  render() {
    return (
      <>
        <TouchableOpacity
          style={styles.action_button}
          onPress={() => this. handleAction()}>
          <CustomIcon name={'action24'} size={20} color={colors.gray_icon} />
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  action_button: {
    paddingLeft: 20,
    paddingRight: 15,
  },
});

const ActionButton = connectActionSheet(Actions);

Actions.propTypes = {
  updateLocationData: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    contactLocationData: state.contactLocationReducer,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  updateLocationData,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionButton);
