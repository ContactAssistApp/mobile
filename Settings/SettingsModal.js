import React, {Component} from 'react';
import Notification from './Notification';
import Location from './Location';
import Bluetooth from './Bluetooth';
import DataStorage from './DataStorage';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomIcon from '../assets/icons/CustomIcon.js';
import colors from '../assets/colors';
import Modal from '../views/Modal';

class SettingsModal extends Component {
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
    return (
      <>
        <Modal
          visible={this.state.modalOn}
          handleModalClose={this.handleModalClose}
          title={'Settings'}>
          <Notification />
          <Location />
          <Bluetooth />
          <DataStorage />
        </Modal>

        <TouchableOpacity onPress={() => this.setState({modalOn: true})}>
          <CustomIcon
            name={'settings24'}
            color={colors.gray_icon}
            size={24}
          />
        </TouchableOpacity>
      </>
    );
  }
}

export default SettingsModal;
