import React, {Component} from 'react';
import SymptomsList from './SymptomsList';
import ContactsList from './ContactsList';
import LocationsList from './LocationsList';

class SummaryList extends Component {
  render() {
    return (
      <>
        <SymptomsList />
        <LocationsList />
        <ContactsList />
      </>
    );
  }
}

export default SummaryList;
