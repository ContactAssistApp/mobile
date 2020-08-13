import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {editLocation, resetLocation} from './actions.js';
import {getLocationsWithTs} from 'realm/realmLocationTasks';
import {strings} from 'locales/i18n';
import LocationField from './LocationField';
import PropTypes from 'prop-types';

class NewLocation extends Component {
  componentDidMount() {
    const {time} = this.props;
    this.fetchLocation(time);
  }

  componentWillUnmount() {
    this.props.resetLocation();
  }

  fetchLocation = async time => {
    const location = await getLocationsWithTs(time);
    if (location) {
      this.props.editLocation({
        name: location.name ? location.name : '',
        address: location.address ? location.address : '',
      });
    }
  };

  handleCallback = (field, initVal, val) => {
    if (initVal === val) {
      this.props.editLocation({
        [field]: val,
        enableSave: false,
      });
    } else {
      this.props.editLocation({
        [field]: val,
        enableSave: true,
      });
    }
  };

  render() {
    const {
      newLocationData: {name, address},
    } = this.props;

    return (
      <>
        <LocationField
          icon={'building24'}
          name={strings('locations.name')}
          value={name}
          handleCallback={this.handleCallback}
          field={'name'}
        />

        <LocationField
          icon={'location24'}
          name={strings('locations.address')}
          value={address}
          handleCallback={this.handleCallback}
          field={'address'}
        />
      </>
    );
  }
}

NewLocation.propTypes = {
  editLocation: PropTypes.func.isRequired,
  resetLocation: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    newLocationData: state.newLocationReducer,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  editLocation,
  resetLocation,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewLocation);
