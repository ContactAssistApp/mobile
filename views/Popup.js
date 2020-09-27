import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Modal as NativeModal,
} from 'react-native';
import colors from 'assets/colors';
import PropTypes from 'prop-types';

class Popup extends Component {
  render() {
    const {visible} = this.props;

    return (
      <NativeModal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={this.handleOnPressOverlay}>
        <TouchableWithoutFeedback>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.container}>{this.props.children}</View>
      </NativeModal>
    );
  }
}

Popup.propTypes = {
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
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: '5%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});

export default Popup;
