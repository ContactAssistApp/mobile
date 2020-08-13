import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal as NativeModal,
} from 'react-native';
import CustomIcon from 'assets/icons/CustomIcon.js';
import colors from 'assets/colors';
import PropTypes from 'prop-types';

class Modal extends Component {
  render() {
    const {visible, title, actionButton} = this.props;

    return (
      <NativeModal
        presentationStyle="pageSheet"
        visible={visible}
        animationType="slide">
        <SafeAreaView style={styles.status_bar} />
        <View style={styles.header}>
          <View style={styles.title_wrapper}>
            <TouchableOpacity onPress={this.props.handleModalClose}>
              <CustomIcon name={'close24'} color={colors.gray_icon} size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
          </View>
          {actionButton && this.props.actionButton}
        </View>
        {this.props.children}
      </NativeModal>
    );
  }
}

Modal.propTypes = {
  visible: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  status_bar: {
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.card_border,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title_wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    paddingLeft: 20,
    fontSize: 24,
    color: colors.section_title,
    fontWeight: '500',
  },
});

export default Modal;
