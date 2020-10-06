import React, {Component} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import colors from 'assets/colors';
import ContactsList from './ContactsList';
import {strings} from 'locales/i18n';

class People extends Component {
  render() {
    return (
      <>
        <View style={styles.intro_container}>
          <View style={styles.header}>
            <Image
              style={styles.icon}
              source={require('assets/health/people.png')}
            />
            <Text style={styles.title}>{strings('contact.title_3')}</Text>
          </View>
          <Text style={styles.description}>{strings('contact.desc_3')}</Text>
        </View>
        <ContactsList />
      </>
    );
  }
}

const styles = StyleSheet.create({
  intro_container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  icon: {
    width: 50,
    height: 60,
  },
  title: {
    paddingLeft: 20,
    fontSize: 18,
    lineHeight: 25,
    color: colors.section_title,
    flex: 1,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.module_title,
    paddingHorizontal: 20,
  },
  section_title: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 18,
    textTransform: 'uppercase',
    color: colors.secondary_body_copy,
    padding: 20,
    backgroundColor: colors.card_border,
  },
});

export default People;
