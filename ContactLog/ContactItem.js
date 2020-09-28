import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import CustomIcon from 'assets/icons/CustomIcon.js';
import colors from 'assets/colors';
import {updateSymptom, clearSymptoms} from './actions.js';
import {bindActionCreators} from 'redux';
import Modal from 'views/Modal';
import {connect} from 'react-redux';
import {strings} from 'locales/i18n';
import {connectActionSheet} from '@expo/react-native-action-sheet';
import Edit from './NewContact/EditContact';
import Save from './NewContact/SaveContact';
import {editContact} from './NewContact/actions.js';
import Person from 'utils/person';

class ContactItemComp extends Component {
  constructor() {
    super();
    this.state = {
      manualContactModalOn: false,
    };
  }

  openManualContactModal = () => {
    this.setState({
      manualContactModalOn: true,
    });
  };

  closeManualContactModal = () => {
    this.setState({
      manualContactModalOn: false,
    });
  };

  handleAction = () => {
    this.props.showActionSheetWithOptions({
      options: ['Cancel', 'View Detail', 'Remove Contact'],
      destructiveButtonIndex: 2,
      cancelButtonIndex: 0,
    }, buttonIndex => {
      if (buttonIndex === 1) {
        const {contact: {name, phone, label, notes, id}} = this.props;
        this.props.editContact({
          name, phone, label, notes, id,
          enableSave: false,
        });
        this.openManualContactModal();
      } else if (buttonIndex === 2) {
        Person.deleteContact(
          this.props.contact
        );
        this.props.onRemoveContact();
      }
    });
  };

  render() {
    const {
      contact: {name, notes},
    } = this.props;

    const saveButton = (
      <Save
        editContactData={this.props.contact}
        date={this.props.date}
        isEditing={true}
        handleSaveSuccess={() => {
          this.closeManualContactModal();
        }}
        onEditContactItem={this.props.onEditContactItem}
      />
    );

    return (
      <>
        <Modal
          visible={this.state.manualContactModalOn}
          handleModalClose={this.closeManualContactModal}
          title={strings('create.contact')}
          actionButton={saveButton}>
          <Edit newContactData={this.props.contact} />
        </Modal>
        <View style={styles.ContactItem}>
          <View style={[styles.icon_wrapper, styles.checkmark_wrapper]}>
            <CustomIcon
              name={'checkmark24'}
              size={20}
              color={colors.warning_low}
            />
          </View>
          <View style={styles.ContactItem_detail}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.time}>{notes ? `${notes}` : ''}</Text>
          </View>
          {this.props.noEdit && (
            <TouchableOpacity
              style={styles.action_button}
              onPress={this.handleAction}>
              <CustomIcon
                name={'action24'}
                size={20}
                color={colors.gray_icon}
              />
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  ContactItem: {
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
  ContactItem_detail: {
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

const mapStateToProps = state => {
  return {
    symptoms: state.symptomReducer,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateSymptom,
      clearSymptoms,
      editContact,
    },
    dispatch,
  );

const ContactItem = connectActionSheet(ContactItemComp);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactItem);
