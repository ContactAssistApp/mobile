import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import colors from 'assets/colors';
import CustomIcon from 'assets/icons/CustomIcon.js';
import {updateContactLog} from './actions.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {SetStoreData} from 'utils/asyncStorage';
import {strings} from 'locales/i18n';

class ContactList extends Component {
  selectContact = contact => {
    let {
      contactLogData: {selectedContacts},
    } = this.props;

    const index = selectedContacts.findIndex(item => item.id === contact.id);
    if (index !== -1) {
      selectedContacts.splice(index, 1);
      this.props.updateContactLog({
        field: 'selectedContacts',
        value: selectedContacts,
      });
    } else {
      this.props.updateContactLog({
        field: 'selectedContacts',
        value: [...selectedContacts, contact],
      });
    }
  };

  render() {
    const {
      contactLogData: {allContacts, selectedContacts},
    } = this.props;
    return (
      <>
        <FlatList
          style={styles.contacts}
          data={allContacts}
          renderItem={({item: contact}) => {
            return (
              <TouchableOpacity
                key={contact.id}
                style={styles.contact}
                onPress={() => this.selectContact(contact)}>
                <Text style={styles.name}>{contact.name}</Text>
                {selectedContacts && selectedContacts.find(item => item.id === contact.id) && (
                  <CustomIcon
                    name={'checkmark24'}
                    color={colors.gray_icon}
                    size={24}
                  />
                )}
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item.id}
          removeClippedSubviews={true}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={100}
          windowSize={10}
        />
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.save}
            onPress={() => {
              SetStoreData('CONTACTS', selectedContacts);
              this.props.handleModalClose();
            }}>
            <Text style={styles.save_text}>{strings("save.text")}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  contacts: {
    marginBottom: 60,
  },
  contact: {
    paddingTop: 22,
    paddingBottom: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    lineHeight: 24,
    color: '#212121',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  save: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.primary_theme,
    paddingVertical: 15,
    alignItems: 'center',
  },
  save_text: {
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: 'white',
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
)(ContactList);
