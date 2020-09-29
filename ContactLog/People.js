import React, {Component} from 'react';
import Contacts from 'react-native-contacts';
import ContactList from './ContactList';
import CustomIcon from 'assets/icons/CustomIcon.js';
import Modal from 'views/Modal';
import NewContact from './NewContact/NewContact';
import Person from 'utils/person';
import PropTypes from 'prop-types';
import Save from './NewContact/SaveContact';
import SelectedContacts from './SelectedContacts';
import colors from 'assets/colors';
import {StyleSheet, Text, ScrollView, Platform} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {strings} from 'locales/i18n';
import {updateContactLog} from './actions.js';

class People extends Component {
  constructor() {
    super();
    this.state = {
      contactListModalOn: false,
      addContactModalOn: false,
    };
  }

  componentDidMount() {
    const {date} = this.props;
    this.fetchSelectedContactsByDate(date);
    this.fetchAllContacts();
  }

  componentDidUpdate(prevProps) {
    const {date} = this.props;
    if (prevProps.date !== date) {
      this.fetchSelectedContactsByDate(date);
    }
  }

  fetchSelectedContactsByDate = async date => {
    const persons = await Person.fetchContactsByDate(
      new Date(date.replace(/-/g, '/')),
    );
    this.props.updateContactLog({
      field: 'selectedContacts',
      value: persons,
    });
  };

  fetchAllContacts = () => {
    const contactPermission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.READ_CONTACTS
        : PERMISSIONS.IOS.CONTACTS;
    check(contactPermission).then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          request(contactPermission).then(() => {
            this.loadContacts();
          });
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          this.loadContacts();
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          break;
      }
    });
  };

  loadContacts = () => {
    Contacts.getAllWithoutPhotos((err, contacts) => {
      if (err) {
        console.log('getting contact error: ', err);
        return;
      }

      const contactList = contacts.map(contact => {
        return {
          id: contact.recordID,
          name: `${contact.givenName} ${contact.familyName}`,
          phone: (contact.phoneNumbers && contact.phoneNumbers.length > 0)
            ? contact.phoneNumbers[0].number : '',
        };
      })
      .sort(function(a, b) {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        } else if (nameA > nameB) {
          return 1;
        }
        return 0;
      });

      this.props.updateContactLog({
        field: 'allContacts',
        value: contactList,
      });
    });
  };

  openModal = () => {
    this.setState({
      contactListModalOn: true,
    });
  };

  closeModal = () => {
    this.setState({
      contactListModalOn: false,
    });
  };

  openalContactModal = () => {
    this.setState({
      addContactModalOn: true,
    });
  };

  closeManualContactModal = () => {
    this.setState({
      addContactModalOn: false,
    });
  };

  render() {
    const {
      contactLogData: {selectedContacts},
      date,
    } = this.props;

    const {contactListModalOn, addContactModalOn} = this.state;
    const saveButton = (
      <Save date={this.props.date} handleSaveSuccess={() => {}} />
    );

    return (
      <>
        <Modal
          visible={contactListModalOn}
          handleModalClose={this.closeModal}
          title={strings('select.contact')}>
          <ContactList handleModalClose={this.closeModal} date={date} />
        </Modal>
        <Modal
          visible={this.state.addContactModalOn}
          handleModalClose={this.closeManualContactModal}
          title={strings('create.contact')}
          actionButton={saveButton}>
          <NewContact />
        </Modal>
        <ScrollView>
          <Text style={styles.header}>
            {strings('people.social_interactions_header')}
          </Text>
          <SelectedContacts
            date={this.props.date}
            selectedContacts={selectedContacts}
            refreshContacts={this.fetchSelectedContactsByDate}
          />
        </ScrollView>
        <TouchableOpacity onPress={this.openModal} style={styles.add_button}>
          <CustomIcon name={'add24'} color={'white'} size={20} />
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    lineHeight: 25,
    textTransform: 'capitalize',
    color: colors.module_title,
    margin: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
    color: '#141414',
    padding: 20,
    backgroundColor: 'white',
  },
  add_button: {
    backgroundColor: colors.primary_theme,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  manual_add_button: {
    backgroundColor: colors.primary_theme,
    width: 150,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 100,
    right: 100,
  },
  enable_permission_button: {
    backgroundColor: colors.primary_theme,
    width: 200,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 130,
    right: 100,
  },
  contact_wrapper: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
    padding: 21,
  },
  contact: {
    fontSize: 16,
    lineHeight: 24,
    color: '#212121',
  },
});

ContactList.propTypes = {
  updateContactLog: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    contactLogData: state.contactLogReducer,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateContactLog
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(People);
