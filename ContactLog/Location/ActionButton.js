import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import colors from 'assets/colors';
import {strings} from 'locales/i18n';
import CustomIcon from 'assets/icons/CustomIcon.js';
import {deleteLocation} from 'realm/realmLocationTasks';
import {connectActionSheet} from '@expo/react-native-action-sheet';

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
          // edit
        } else if (buttonIndex === 2) {
          if (time) {
            deleteLocation(time);
          }
        }
        this.props.refreshLocations();
      },
    );
  };

  render() {
    return (
      <TouchableOpacity
        style={styles.action_button}
        onPress={() => this.handleAction()}>
        <CustomIcon name={'action24'} size={20} color={colors.gray_icon} />
      </TouchableOpacity>
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

export default ActionButton;
