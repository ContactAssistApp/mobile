import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import colors from 'assets/colors';
import SymptomsList from './SymptomsList';
import SelectedContacts from 'ContactLog/SelectedContacts';
import SectionHeader from './SectionHeader';
import LocationsList from './LocationsList';
import {strings} from 'locales/i18n';

class Summary extends Component {
  render() {
    return (
      <ScrollView>
        <View style={styles.intro_container}>
          <View style={styles.header}>
            <Image
              style={styles.icon}
              source={require('../assets/health/summary.png')}
            />
            <Text style={styles.title}>{strings('contact.title_4')}</Text>
          </View>
          <Text style={styles.description}>{strings('contact.desc_4')}</Text>
        </View>
        <View style={styles.section_title_container}>
          <Text style={styles.section_title}>{strings('summary.text')}</Text>
        </View>
        <SymptomsList />
        <LocationsList />
        <SectionHeader header={strings('people.text')} />
        <SelectedContacts />
      </ScrollView>
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
    width: 54,
    height: 55,
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
    fontSize: 18,
    lineHeight: 25,
    textTransform: 'capitalize',
    color: colors.section_title,
  },
  section_title_container: {
    backgroundColor: colors.card_border,
    padding: 20,
  },
});

export default Summary;
