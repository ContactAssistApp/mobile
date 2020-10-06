import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {strings} from 'locales/i18n';
import colors from 'assets/colors';
import Person from 'utils/person';
import {updateContactLog} from '../actions.js';

class Save extends Component {
  handleSave = async () => {
    let {
      date,
      newContactData: {name, phone, label, notes, id},
    } = this.props;
    const requiredFields = [name, phone];
    console.log('Saving manual contact', date, name, phone, label, notes);

    requiredFields.find(field => {
      if (!field) {
        Alert.alert('', strings('Contacts.required_field_alert'), [
          {
            text: strings('Contacts.alert_dismiss_button'),
            style: 'cancel',
          },
        ]);
      }
    });

    if (name) {
      const savedContact = {
        time: new Date(date.replace(/-/g, '/')).getTime(),
        id: id ? id : (Math.random() * 1e32).toString(36), // TODO: Should properly generate random string here,
        name: name,
        phone: phone,
        label: label,
        notes: notes,
      };
      if (this.props.isEditing) {
        Person.updateContact(savedContact);
        const editContactFn = this.props.onEditContactItem();
        editContactFn(savedContact);
      } else {
        Person.savePerson(savedContact);
        this.props.updateContactLog({
          field: 'selectedContacts',
          value: [...this.props.contactLogData.selectedContacts, savedContact],
        });
      }
      this.props.handleSaveSuccess();
    }
  };

  render() {
    const {
      newContactData: {enableSave},
    } = this.props;

    const disableClass = enableSave ? styles.active : '';

    return (
      <>
        <TouchableOpacity disabled={!enableSave} onPress={this.handleSave}>
          <Text style={[styles.save_button, disableClass]}>
            {strings('contacts.save_button')}
          </Text>
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  save_button: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  active: {
    color: colors.primary_theme,
  },
});

const mapStateToProps = state => {
  return {
    newContactData: state.newContactReducer,
    contactLogData: state.contactLogReducer,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateContactLog
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Save);
