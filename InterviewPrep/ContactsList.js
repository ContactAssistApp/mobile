import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from 'assets/colors';
import SectionHeader from './SectionHeader';
import Person from 'utils/person';
import {strings} from 'locales/i18n';
import DateHeader from './DateHeader';
import DateConverter from 'utils/date';

class ContactsList extends Component {
  constructor() {
    super();
    this.state = {
      contacts: {},
    };
  }

  componentDidMount() {
    this.fetchContacts();
  }

  fetchContacts = async () => {
    const contacts = await Person.fetchContactsByDate(new Date(), 14);

    let contactsMap = {};
    contacts.map(contact => {
      const {time} = contact;
      const date = DateConverter.calendarFormat(new Date(time));
      if (!Object.keys(contactsMap).includes(date)) {
        contactsMap[date] = [];
      }
      contactsMap[date].push(contact);
    });
    this.setState({
      contacts: contactsMap,
    });
  };

  render() {
    const {contacts} = this.state;
    return (
      <>
        <SectionHeader header={strings('people.text')} />
        {Object.entries(contacts).map(([key, val]) => {
          return (
            <View key={key}>
              <DateHeader date={key} />
              {val.map((item, idx) => {
                const {name, phone, notes} = item;
                return (
                  <View style={styles.contact_card} key={idx}>
                    <Text style={styles.name}>{name}</Text>
                    {phone !== '' && (
                      <Text style={styles.metadata}>{phone}</Text>
                    )}
                    {notes !== '' && (
                      <Text style={styles.metadata}>{notes}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}
      </>
    );
  }
}

const styles = StyleSheet.create({
  contact_card: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
    paddingVertical: 17,
    paddingHorizontal: 19,
  },
  name: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 23,
  },
  metadata: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.body_copy,
    paddingVertical: 2,
    fontWeight: '400',
  },
});

export default ContactsList;
