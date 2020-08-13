import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {editLocation} from './actions.js';
import {getLocationsWithTs} from 'realm/realmLocationTasks';
import {strings} from 'locales/i18n';
import LocationField from './LocationField';
import PropTypes from 'prop-types';

class NewLocation extends Component {
  componentDidMount() {
    const {time} = this.props;
    this.fetchLocation(time);
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
        />

        <LocationField
          icon={'location24'}
          name={strings('locations.address')}
          value={address}
        />
        <LocationField icon={'clock24'} name={strings('locations.start')} />
        <LocationField name={strings('locations.end')} />
      </>
    );
  }
}

NewLocation.propTypes = {
  editLocation: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    newLocationData: state.newLocationReducer,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  editLocation,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewLocation);
