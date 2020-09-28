import React, {Component} from 'react';
import SymptomsList from './SymptomsList';
import SelectedContacts from 'ContactLog/SelectedContacts';
import SectionHeader from './SectionHeader';
import LocationsList from './LocationsList';
import {strings} from 'locales/i18n';

class SummaryList extends Component {
  render() {
    return (
      <>
        <SymptomsList />
        <LocationsList />
        <SectionHeader header={strings('people.text')} />
        <SelectedContacts />
      </>
    );
  }
}

export default SummaryList;
