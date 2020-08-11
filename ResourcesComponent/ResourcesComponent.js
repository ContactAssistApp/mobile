import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import colors from 'assets/colors';
import Resource from './Resource';
import {CDC_URL, KC_GUIDANCE_URL} from 'utils/constants';
import {strings} from 'locales/i18n';

class ResourcesComponent extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header_container}>
          <Text style={styles.header}>
            {strings('bottom.sheet_menu_item_resources')}
          </Text>
        </View>
        <Resource
          title={strings('resources_component.cdc_title')}
          content={strings('resources_component.cdc_description')}
          logoName={'cdc'}
          url={CDC_URL}
        />
        <Resource
          title={strings('resources_component.king_county_title')}
          content={strings('resources_component.king_county_description')}
          logoName={'kc'}
          url={KC_GUIDANCE_URL}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 15,
  },
  header_container: {
    paddingVertical: 20,
  },
  header: {
    color: colors.module_title,
    fontSize: 18,
    lineHeight: 22,
  },
});

export default ResourcesComponent;
