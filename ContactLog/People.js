import React, {Component} from 'react';
import {StyleSheet, Text, ScrollView, Platform} from 'react-native';
import colors from 'assets/colors';
import Contacts from 'react-native-contacts';
import {TouchableOpacity} from 'react-native';
import CustomIcon from 'assets/icons/CustomIcon.js';
import Modal from 'views/Modal';
import ContactList from './ContactList';
import {updateContactLog} from './actions.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import SelectedContacts from './SelectedContacts';
import {strings} from '../locales/i18n';
import {request, PERMISSIONS, check, RESULTS} from 'react-native-permissions';
import Person from '../utils/person';
import Contacts from 'react-native-contacts';

class People extends Component {
  constructor() {
    super();
    this.state = {
      modalOn: false
    };
  }

  componentDidMount() {
    const { date } = this.props;
    this.fetchSelectedContactsByDate(date);
    this.fetchAllContacts();
  }

  componentDidUpdate(prevProps) {
    const { date } = this.props;
    if (prevProps.date !== date) {
      this.fetchSelectedContactsByDate(date);
    }
  }

  fetchSelectedContactsByDate = async (date) => {
    const persons = await Person.fetchContactsByDate(
      new Date(date.replace(/-/g, '/')),
    );
    this.props.updateContactLog({
      field: 'selectedContacts',
      value: persons,
    });
  }

  fetchAllContacts = () => {
    const contactPermission = Platform.OS === 'android' ? PERMISSIONS.ANDROID.READ_CONTACTS : PERMISSIONS.IOS.CONTACTS;
    check(contactPermission)
    .then((result) => {
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
            request(contactPermission).then((result) => {
              this.loadContacts();
          })
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            this.loadContacts();
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      }
    )
  }

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
      modalOn: true,
    });
  };

  closeModal = () => {
    this.setState({
      modalOn: false,
    });
  };

  render() {
    const { selectedContacts } = this.props.contactLogData;
    return (
      <>
        <Modal
          visible={this.state.modalOn}
          handleModalClose={this.closeModal}
          title={strings('select.contact')}>
          <ContactList
            handleModalClose={this.closeModal}
            date={this.props.date}
          />
        </Modal>
        <ScrollView>
          <Text style={styles.header}>
            {strings("social.interaction_text")}
          </Text>
          <SelectedContacts selectedContacts={selectedContacts}/>
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
  updateContactLog: PropTypes.func.isRequired,
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
