import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import colors from 'assets/colors';
import SymptomsList from './SymptomsList';
import {strings} from 'locales/i18n';

class Symptoms extends Component {
  render() {
    return (
      <>
        <View style={styles.intro_container}>
          <View style={styles.header}>
            <Image
              style={styles.clipboard}
              source={require('../assets/health/clipboard.png')}
            />
            <Text style={styles.title}>{strings('contact.title_1')}</Text>
          </View>
          <Text style={styles.description}>{strings('contact.desc_1')}</Text>
        </View>
        <SymptomsList />
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
  clipboard: {
    width: 60,
    height: 70,
  },
  title: {
    paddingLeft: 10,
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

export default Symptoms;
