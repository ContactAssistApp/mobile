import React, {Component} from 'react';
import Notification from './Notification';
import Location from './Location';
import Bluetooth from './Bluetooth';
import DataStorage from './DataStorage';
import Import from './Import';
import {ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import CustomIcon from '../assets/icons/CustomIcon.js';
import colors from '../assets/colors';
import Modal from '../views/Modal';
import SettingLink from './SettingLink';
import AnalyticsOptIn from './AnalyticsOptIn';
import {UW_URL} from '../utils/constants.js';

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
          <ScrollView>
            <>
              <Text style={styles.section_title}>Tracing</Text>
              <Notification />
              <Location />
              <Bluetooth />
              <Import />
              <DataStorage />
              <AnalyticsOptIn />
            </>

            <>
              <Text style={styles.section_title}>More</Text>
              <SettingLink iconName={'share24'} title={'Share'} />
              <SettingLink
                iconName={'logo24'}
                title={'About CovidSafe'}
                url={UW_URL}
              />
              <SettingLink
                iconName={'readingMode24'}
                title={'FAQ'}
                url={UW_URL}
              />
            </>
          </ScrollView>
        </Modal>
        <TouchableOpacity onPress={() => this.setState({modalOn: true})}>
          <CustomIcon name={'settings24'} color={colors.gray_icon} size={24} />
        </TouchableOpacity>
      </>
    );
  }
}
const styles = StyleSheet.create({
  section_title: {
    paddingLeft: 16,
    paddingBottom: 8,
    paddingTop: 24,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.078,
    color: colors.gray_icon,
    backgroundColor: colors.card_border,
  },
});
export default SettingsModal;
