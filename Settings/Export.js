import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import colors from 'assets/colors';
import CustomIcon from 'assets/icons/CustomIcon.js';
import {strings} from 'locales/i18n';
import Share from 'react-native-share';
import RealmObj from 'realm/realm';
import * as RNFS from 'react-native-fs';

const Buffer = require('buffer').Buffer;

class Export extends Component {
  async exportData() {
    let real = await RealmObj.init();
    let logLines = await new Promise((resolve, reject) => {
      BackgroundGeolocation.getLogEntries(500, 0, 'DEBUG', newLogEntries => {
        resolve(newLogEntries);
      }, error => {
        let msg = "failed to lookup logs due to: " + JSON.stringify(error);
        console.log(msg);
        resolve(msg);
      })
    });

    let dump = {
      'narrowcast-locations': real.objects('NarrowcastLocation'),
      'areas': real.objects('Area'),
      'area-matches': real.objects('AreaMatches'),
      'locations': real.objects('Location'),
      'symptoms': real.objects('Symptoms'),
      'app-log': real.objects('BackgroundTaskLog'),
      'gps-log': logLines,
    };
    let path;
    try {
      let the_url = null;
      if (Platform.OS === 'android') {
        let encodedData = new Buffer(JSON.stringify(dump)).toString("base64");
        the_url = 'data:text/plain;base64,' + encodedData;
      } else {
        path = RNFS.DocumentDirectoryPath + '/dump.json';
        try {
          await RNFS.unlink(path);
        } catch (e) {
          // unlink fails if the file doesn't exist, which is fine
        }

        await RNFS.writeFile(path, JSON.stringify(dump), 'utf8');
        the_url = 'file://' + path;
      }
      console.log('dump created successfully');

      let res = await Share.open({
        url: the_url,
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
        await RNFS.unlink(path);
      } catch (e) {
        // unlink fails if the file doesn't exist, which is fine
      }
    }
  }

  render() {
    return (
      <>
        <TouchableOpacity style={styles.row} onPress={this.exportData}>
          <CustomIcon
            name={'export24'}
            color={colors.gray_icon}
            size={24}
            style={styles.icon}
          />
          <View style={styles.content}>
            <Text style={styles.title}>{strings('export.title')}</Text>
            <Text style={styles.description}>
              {strings('export.description')}
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 19,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    paddingRight: 15,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.408,
    color: colors.body_copy,
    paddingBottom: 5,
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: colors.secondary_body_copy,
  },
});

export default Export;
