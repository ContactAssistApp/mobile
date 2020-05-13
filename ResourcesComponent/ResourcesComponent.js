import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import colors from '../assets/colors';
import Resource from './Resource';
import {CDC_URL, NYC_GUIDANCE_URL} from '../utils/constants';
import { strings } from '../locales/i18n';

class ResourcesComponent extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{strings("bottom.sheet_menu_item_resources")}</Text>
        <Resource title={strings("cdc.guidance_text")} logoName={'cdc'} url={CDC_URL} />
        <Resource
          title={'NYC Guidance'}
          logoName={'nyc'}
          url={NYC_GUIDANCE_URL}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: 0.35,
    color: colors.section_title,
    padding: 24,
  },
});

export default ResourcesComponent;
