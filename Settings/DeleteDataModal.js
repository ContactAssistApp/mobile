import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Modal from 'views/Modal';
import {strings} from 'locales/i18n';
import colors from 'assets/colors';
import {deleteLocationLog} from 'realm/realmLocationTasks';
import StatusAlert from 'views/StatusAlert';

class DeleteDataModal extends Component {
  constructor() {
    super();

    this.state = {
      status: '',
      text: '',
      showAlert: false,
    };
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        handleModalClose={this.props.handleModalClose}
        useScrollView={false}
        title={strings('data_storage_modal.title')}>
        <View style={styles.container}>
          <Text style={styles.desc_1}>
            {strings('data_storage_modal.desc_1')}
          </Text>
          <Text style={styles.desc_2}>
            {strings('data_storage_modal.desc_2')}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.delete_button}
          onPress={() => {
            deleteLocationLog(status => {
              if (status === 'success') {
                this.setState({
                  status: 'success',
                  text: strings('data_storage_modal.delete_success'),
                });
              } else {
                this.setState({
                  status: 'failure',
                  text: strings('data_storage_modal.delete_failure'),
                });
              }

              this.setState({
                showAlert: true,
              });
            });
          }}>
          <Text style={styles.delete_button_text}>
            {strings('data_storage_modal.delete_button')}
          </Text>
        </TouchableOpacity>
        {this.state.showAlert && (
          <View style={styles.status_alert}>
            <StatusAlert
              status={'success'}
              text={this.state.text}
              showAlertCallback={() => {
                this.setState({
                  showAlert: false,
                });
              }}
            />
          </View>
        )}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 25,
    paddingHorizontal: 21,
  },
  desc_1: {
    fontSize: 14,
    lineHeight: 18,
    paddingBottom: 25,
  },
  desc_2: {
    fontSize: 14,
    lineHeight: 18,
  },
  delete_button: {
    backgroundColor: colors.primary_theme,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 8,
    margin: 20,
  },
  delete_button_text: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
  },
  status_alert: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default DeleteDataModal;
