import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import colors from '../assets/colors';
import Resource from './Resource';
import {CDC_URL, NYC_GUIDANCE_URL} from '../utils/constants';
import {LocalizationContext} from '../components/Translations';

class ResourcesComponent extends Component {
  static contextType = LocalizationContext;
  
  render() {
	const {translations, initializeAppLanguage} = this.context;
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{translations["resources_component.resource"]}</Text>
        <Resource title={'CDC Guidance'} logoName={'cdc'} url={CDC_URL} />
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
