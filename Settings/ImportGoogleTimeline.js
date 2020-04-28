import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Modal from '../views/Modal';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../assets/colors';
import LocationHistoryImportView from './LocationHistoryImportView.js';

class ImportGoogleTimeline extends Component {
  constructor() {
    super();
    this.state = {
      googleSignInVisible: false,
    };
  }

  handleModalClose = () => {
    this.setState({googleSignInVisible: false});
  };

  render() {
    return (
      <>
        <Modal
          visible={this.state.googleSignInVisible}
          handleModalClose={this.handleModalClose}
          useScrollView={false}
          title={'Sign-in to Google'}>
          <LocationHistoryImportView
            isVisible={this.state.googleSignInVisible}
            style={styles.wrapper}
            // TODO: logWindow={getLogWindow()}
            // or better, sync that to native side
            // For now, defaults to 14
            onReceivingPlacemarks={dict => {
              console.log(dict);
              this.handleModalClose();
            }}
          />
        </Modal>
        <View style={styles.row}>
          <Icon
            name={'logo-google'}
            color={colors.gray_icon}
            size={24}
            style={styles.icon}
          />
          <View style={styles.content}>
            <Text style={styles.title}>Import Location History</Text>
          </View>

          <TouchableOpacity
            onPress={() => this.setState({googleSignInVisible: true})}>
            <Text style={styles.button}>Import</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
  },
  icon: {
    flex: 1,
    paddingRight: 15,
    paddingLeft: 3,
  },
  content: {
    flex: 11,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.408,
    color: colors.body_copy,
  },
  button: {
    flex: 1,
    padding: 8,
    color: colors.icon_on,
    fontWeight: 'bold',
  },
  wrapper: {
    flex: 1,
  },
});

export default ImportGoogleTimeline;
