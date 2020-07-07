import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Modal from '../views/Modal';
import {strings} from '../locales/i18n';
import colors from '../assets/colors';
import {deleteLocationLog} from '../realm/realmLocationTasks';

class DeleteDataModal extends Component {
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
          onPress={deleteLocationLog}>
          <Text style={styles.delete_button_text}>
            {strings('data_storage_modal.delete_button')}
          </Text>
        </TouchableOpacity>
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
});

export default DeleteDataModal;
