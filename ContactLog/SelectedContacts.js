import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from 'assets/colors';
import ContactList from './ContactList';
import {updateContactLog} from './actions.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {GetStoreData} from 'utils/asyncStorage';
import {strings} from 'locales/i18n';

class SelectedContacts extends Component {
  componentDidMount() {
    this.fetchSelectedContacts();
  }

  fetchSelectedContacts = () => {
    return GetStoreData('CONTACTS').then(selectedContacts => {
      if (selectedContacts) {
        this.props.updateContactLog({
          field: 'selectedContacts',
          value: JSON.parse(selectedContacts),
        });
      }
    });
  };

  render() {
    const {
      contactLogData: {selectedContacts},
    } = this.props;

    return (
      <>
        {selectedContacts && selectedContacts.length > 0
          ? <View>
            {selectedContacts.map(contact => {
              return (
                <View style={styles.contact_wrapper} key={contact.id}>
                  <Text style={styles.contact}>{contact.name}</Text>
                </View>
              )
            })}
            </View>
          : <Text style={styles.description}>
            {strings('socialize.text')}
            </Text>
        }
      </>
    );
  }
}

const styles = StyleSheet.create({
  description: {
    fontSize: 14,
    lineHeight: 18,
    color: '#141414',
    padding: 20,
    backgroundColor: 'white',
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
)(SelectedContacts);
