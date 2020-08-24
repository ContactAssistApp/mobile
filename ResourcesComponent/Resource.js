import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  View,
} from 'react-native';
import colors from 'assets/colors';

class Resource extends Component {
  render() {
    const logos = {
      cdc: require('../assets/resources/cdc.png'),
      nyc: require('../assets/resources/nyc.png'),
      kc: require('../assets/resources/kclogo.png'),
    };
    const {logoName, title, url, content} = this.props;

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => Linking.openURL(url)}>
        <Image style={styles.logo} source={logos[logoName]} />
        <View style={styles.content_wrapper}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.content}>{content}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: colors.card_border,
  },
  logo: {
    height: 50,
    width: 50,
    marginRight: 24,
  },
  content_wrapper: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
    color: '#212121',
    fontWeight: '500',
  },
  content: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.body_copy,
    paddingTop: 5,
  },
});

export default Resource;
