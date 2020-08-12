import React, {Component} from 'react';
import {strings} from 'locales/i18n';
import LocationField from './LocationField';

class NewLocation extends Component {
  render() {
    return (
      <>
        <LocationField icon={'building24'} name={strings('locations.name')} />
        <LocationField
          icon={'location24'}
          name={strings('locations.address')}
        />
        <LocationField icon={'clock24'} name={strings('locations.start')} />
        <LocationField name={strings('locations.end')} />
      </>
    );
  }
}

export default NewLocation;
