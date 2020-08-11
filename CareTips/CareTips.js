import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, Linking} from 'react-native';
import {strings} from 'locales/i18n';
import Tip from './Tip';
import {CDC_URL} from 'utils/constants';
import colors from 'assets/colors';

class CareTips extends Component {
  render() {
    const {header, tips} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.header_container}>
          <Text style={styles.header}>{header}</Text>
        </View>

        {tips.map((tip, idx) => {
          return (
            <Tip
              key={idx}
              icon={tip.icon}
              title={tip.title}
              content={tip.content}
            />
          );
        })}

        <View style={styles.cdc_container}>
          <Image
            style={styles.cdc_logo}
            source={require('assets/resources/cdc.png')}
          />
          <Text style={styles.cdc_info}>
            {strings('care_tips_container.cdc_info')}
          </Text>
          <Text
            style={styles.cdc_link}
            onPress={() => Linking.openURL(CDC_URL)}>
            <Text>{strings('care_tips_container.cdc_link')}</Text>
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  header_container: {
    paddingVertical: 20,
  },
  header: {
    fontSize: 18,
    lineHeight: 22,
    textTransform: 'capitalize',
  },
  cdc_logo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  cdc_container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.card_border,
  },
  cdc_info: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.secondary_body_copy,
  },
  cdc_link: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.secondary_body_copy,
    marginLeft: 5,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: colors.secondary_body_copy,
  },
});

export default CareTips;
