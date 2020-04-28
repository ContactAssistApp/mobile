import React, {Component} from 'react';
import {StyleSheet, Text} from 'react-native';
import colors from '../assets/colors';
import Contacts from 'react-native-contacts';
import {TouchableOpacity} from 'react-native';
import CustomIcon from '../assets/icons/CustomIcon.js';

class People extends Component {
  constructor() {
    super();
    this.state = {
      contactList: [],
    };
  }

  loadContact = () => {
    Contacts.getAll((err, contacts) => {
      if (err) {
        throw err;
      }
      const contactList = contacts.map(contact => {
        return `${contact.givenName} ${contact.familyName}`;
      });

      this.setState({
        contactList,
      });
    });
  };

  render() {
    return (
      <>
        <Text style={styles.header}>Social Interactions</Text>
        <Text style={styles.description}>
          Safely add people you’ve been in contact with directly from your contacts list, or one at a time.
        </Text>
        <TouchableOpacity onPress={this.loadContact} style={styles.add_button}>
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
  }
});

export default People;
