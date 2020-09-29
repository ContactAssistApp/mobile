import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {editContact, resetContact} from './actions.js';
import {strings} from 'locales/i18n';
import ContactField from './ContactField';
import PropTypes from 'prop-types';

class NewContact extends Component {
  handleCallback = (field, initVal, val) => {
    if (initVal === val) {
      this.props.editContact({
        [field]: val,
        enableSave: false,
      });
    } else {
      this.props.editContact({
        [field]: val,
        enableSave: true,
      });
    }
  };

  render() {
    const {
      newContactData: {name, phone, label, notes},
    } = this.props;
    return (
      <>
        <ContactField
          icon={'building24'}
          name={strings('contacts.name')}
          value={name}
          handleCallback={this.handleCallback}
          field={'name'}
        />

        <ContactField
          icon={'Contact24'}
          name={strings('contacts.phone')}
          value={phone}
          handleCallback={this.handleCallback}
          field={'phone'}
        />

        <ContactField
          icon={'Contact24'}
          name={strings('contacts.notes')}
          value={notes}
          handleCallback={this.handleCallback}
          field={'notes'}
        />
      </>
    );
  }
}

NewContact.propTypes = {
  editContact: PropTypes.func.isRequired,
  resetContact: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    newContactData: state.newContactReducer,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  editContact,
  resetContact,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewContact);
