import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import CustomIcon from 'assets/icons/CustomIcon.js';
import colors from 'assets/colors';
import {strings} from 'locales/i18n';
import DeleteDataModal from './DeleteDataModal';

class DataStorage extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
    };
  }

  render() {
    return (
      <>
        <DeleteDataModal
          visible={this.state.visible}
          handleModalClose={() => {
            this.setState({visible: false});
          }}
        />
        <TouchableOpacity
          style={styles.row}
          onPress={() => this.setState({visible: true})}>
          <CustomIcon
            name={'usage24'}
            color={colors.gray_icon}
            size={24}
            style={styles.icon}
          />
          <View style={styles.content}>
            <Text style={styles.title}>{strings('global.setting1')}</Text>
            <Text style={styles.description}>
              {strings('global.setting1desc')}
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    flex: 1,
    paddingRight: 15,
  },
  content: {
    flex: 11,
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

export default DataStorage;
