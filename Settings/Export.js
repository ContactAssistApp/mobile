import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import colors from '../assets/colors';
import CustomIcon from '../assets/icons/CustomIcon.js';
import {strings} from '../locales/i18n';
import Share from "react-native-share";
import RealmObj from '../realm/realm';
const base64js = require('base64-js');

function toUTF8Array(str) {
  let utf8 = [];
  for (let i = 0; i < str.length; i++) {
      let charcode = str.charCodeAt(i);
      if (charcode < 0x80) utf8.push(charcode);
      else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6),
                    0x80 | (charcode & 0x3f));
      }
      else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12),
                    0x80 | ((charcode>>6) & 0x3f),
                    0x80 | (charcode & 0x3f));
      }
      // surrogate pair
      else {
          i++;
          // UTF-16 encodes 0x10000-0x10FFFF by
          // subtracting 0x10000 and splitting the
          // 20 bits of 0x0-0xFFFFF into two halves
          charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                    | (str.charCodeAt(i) & 0x3ff));
          utf8.push(0xf0 | (charcode >>18),
                    0x80 | ((charcode>>12) & 0x3f),
                    0x80 | ((charcode>>6) & 0x3f),
                    0x80 | (charcode & 0x3f));
      }
  }
  return utf8;
}

class Export extends Component {
  constructor() {
    super();
  }

  async exportData() {
    let real = await RealmObj.init();
    let dump = {
      'narrowcast-locations': real.objects('NarrowcastLocation'),
      'areas': real.objects('Area'),
      'area-matches': real.objects('AreaMatches'),
      'locations': real.objects('Location'),
      'symptoms': real.objects('Symptoms')
    }
    let payload = base64js.fromByteArray(toUTF8Array(JSON.stringify(dump)));
    const options = {
      title: strings('export.message_title'),
      subject: strings('export.subject'),
      message: strings('export.message'),
      filename: 'common-circle-dump',
      url: 'data:text/plain;base64,' + payload,
      failOnCancel: false
    };
    Share.open(options)
      .then((res) => {
        console.log("export ok:" + JSON.stringify(res))
      }).catch((err) => {
        console.log("export failed:" + JSON.stringify(err))
      });
  }

  render() {
    return (
      <>
        <TouchableOpacity
          style={styles.row}
          onPress={this.exportData}>
          <CustomIcon
            name={'export24'}
            color={colors.gray_icon}
            size={24}
            style={styles.icon}
          />
          <View style={styles.content}>
            <Text style={styles.title}>{strings('export.title')}</Text>
            <Text style={styles.description}>{strings('export.description')}</Text>
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
