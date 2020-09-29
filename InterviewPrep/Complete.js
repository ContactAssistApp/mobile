import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import colors from 'assets/colors';
import {strings} from 'locales/i18n';
import SummaryList from './SummaryList';
import Share from 'react-native-share';
import RealmObj from 'realm/realm';
import * as RNFS from 'react-native-fs';

const Buffer = require('buffer').Buffer;

class Complete extends Component {
  async export() {
    let real = await RealmObj.init();

    const locations = real.objects('Location');
    const locationCSV = locations.map(location => {
      let locationObj = JSON.parse(JSON.stringify(location));
      return Object.values(locationObj).map(val => {
        return val;
      }).join('\t');
    }).join('\r\n');

    const symptoms = real.objects('Symptoms');
    const symptomsCSV = symptoms.map(symptom => {
      let symptomsObj = JSON.parse(JSON.stringify(symptom));
      return Object.values(symptomsObj).map(val => {
        return val;
      }).join('\t');
    }).join('\r\n');

    const contacts = real.objects('Person');
    const contactsCSV = contacts.map(contact => {
      let contactObj = JSON.parse(JSON.stringify(contact));
      return Object.values(contactObj).map(val => {
        return val;
      }).join('\t');
    }).join('\r\n');

    let locationPath;
    let symptomsPath;
    let contactsPath;

    try {
      let locationURL;
      let symptomsURL;
      let contactsURL;

      if (Platform.OS === 'android') {
        let encodedLocation = new Buffer(JSON.stringify(locationCSV)).toString('base64');
        let encodedSymptoms = new Buffer(JSON.stringify(symptomsCSV)).toString('base64');
        let encodedContacts = new Buffer(JSON.stringify(contactsCSV)).toString('base64');

        locationURL = 'data:text/csv;base64,' + encodedLocation;
        symptomsURL = 'data:text/csv;base64,' + encodedSymptoms;
        contactsURL = 'data:text/csv;base64,' + encodedContacts;
      } else {
        locationPath = RNFS.DocumentDirectoryPath + '/location.csv';
        symptomsPath = RNFS.DocumentDirectoryPath + '/symptoms.csv';
        contactsPath = RNFS.DocumentDirectoryPath + '/contacts.csv';

        try {
          await RNFS.unlink(locationPath);
          await RNFS.unlink(symptomsPath);
          await RNFS.unlink(contactsPath);
        } catch (e) {
          // unlink fails if the file doesn't exist, which is fine
        }

        await RNFS.writeFile(locationPath, locationCSV, 'utf8');
        await RNFS.writeFile(symptomsPath, symptomsCSV, 'utf8');
        await RNFS.writeFile(contactsPath, contactsCSV, 'utf8');
        locationURL = 'file://' + locationPath;
        symptomsURL = 'file://' + symptomsPath;
        contactsURL = 'file://' + contactsPath;
      }
      console.log('dump created successfully');

      let res = await Share.open({
        urls: [locationURL, symptomsURL, contactsURL],
        filename: 'common-circle-dump',
        message: strings('export.message'),
        failOnCancel: false,
      });
      console.log('sharing ok:' + JSON.stringify(res));
    } catch (e) {
      console.log('sharing failed due to: ' + JSON.stringify(e));
    }

    //delete the file regardless of what happened
    if (Platform.OS !== 'android') {
      try {
        console.log('removing file');
        await RNFS.unlink(locationPath);
        await RNFS.unlink(symptomsPath);
        await RNFS.unlink(contactsPath);
      } catch (e) {
        // unlink fails if the file doesn't exist, which is fine
      }
    }
  }

  render() {
    return (
      <ScrollView>
        <Image
          style={styles.hero}
          source={require('assets/health/interview_prep_bg.png')}
        />
        <View style={styles.container}>
          <Text style={styles.title}>
            {strings('interview_prep_complete.title')}
          </Text>
          <Text style={styles.description}>
            {strings('interview_prep_complete.description')}
          </Text>
          <TouchableOpacity style={styles.send_button} onPress={this.export}>
            <Text style={styles.send_button_text}>
              {strings('interview_prep_complete.send_btn')}
            </Text>
          </TouchableOpacity>
        </View>
        <SummaryList />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: 104,
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    paddingBottom: 5,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.body_copy,
    marginBottom: 12,
  },
  send_button: {
    borderRadius: 8,
    backgroundColor: colors.primary_theme,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  send_button_text: {
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: 'white',
  },
});

export default Complete;
