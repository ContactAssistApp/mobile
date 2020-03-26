import React, {Component} from 'react';
import {Button, Alert} from 'react-native';
import {connect} from 'react-redux';
import {startScan} from './actions.js';
import {bindActionCreators} from 'redux';

class HomeContainer extends Component {
  trackBle = () => {
    this.props.startScan();
  };

  render() {
    return (
      <>
        <Button
          title={'Track BLE'}
          onPress={this.trackBle}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    bleData: state.homeReducer,
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  startScan,
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeContainer);
