import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {StyleSheet, Text, ScrollView} from 'react-native';
import {connectActionSheet} from '@expo/react-native-action-sheet';
import {strings, fmt_date} from 'locales/i18n';
import {updateLocationData} from './actions.js';
import Modal from 'views/Modal';
import NewLocation from 'ContactLog/NewLocation/NewLocation';
import Save from '../NewLocation/Save';
import Disclaimer from 'Privacy/Disclaimer';
import Import from './Import';
import ImportGoogleTimeline from 'GoogleTimeline/ImportGoogleTimeline';
import List from './List';
import Location from 'utils/location';
import MissingLocation from './MissingLocation';
import PropTypes from 'prop-types';
import colors from 'assets/colors';

class LocationsContainer extends Component {
  componentDidMount() {
    const {date} = this.props;
    Promise.resolve(
      this.props.updateLocationData({
        date,
      }),
    ).then(() => {
      this.fetchAddresses();
    });
  }

  componentDidUpdate(prevProps) {
    const {date} = this.props;
    if (prevProps.date !== date) {
      Promise.resolve(
        this.props.updateLocationData({
          date,
        }),
      ).then(() => {
        this.fetchAddresses();
      });
    }
  }

  fetchAddresses = async () => {
    const {
      contactLocationData: {date},
    } = this.props;

    const addresses = await Location.fetchAddresses(
      new Date(date.replace(/-/g, '/')),
    );
    this.props.updateLocationData({
      addresses,
    });
  };

  render() {
    const {
      contactLocationData: {
        date,
        addresses,
        openImportModal,
        openLocationModal,
        selectedTime,
      },
    } = this.props;
    const saveButton = (
      <Save
        selectedTime={selectedTime}
        handleSaveSuccess={() => {
          Promise.resolve(
            this.props.updateLocationData({
              openLocationModal: false,
            }),
          ).then(() => {
            this.fetchAddresses();
          });
        }}
      />
    );

    if (openImportModal && openLocationModal) {
      return null;
    }

    return (
      <ScrollView>
        <ImportGoogleTimeline
          endDateStr={date}
          dateRange={1}
          visible={openImportModal}
          handleModalClose={() => {
            this.props.updateLocationData({
              openImportModal: false,
              isImporting: false,
              imported: true,
            });
            this.fetchAddresses(date);
          }}
        />

        <Modal
          visible={openLocationModal}
          handleModalClose={() => {
            this.props.updateLocationData({
              openLocationModal: false,
            });
          }}
          useScrollView={false}
          title={strings('locations.edit_location_header')}
          actionButton={saveButton}>
          <NewLocation time={selectedTime} />
        </Modal>

        {addresses && addresses.length > 0 ? (
          <>
            <Text style={styles.date}>
              {fmt_date(new Date(date.replace(/-/g, '/')), 'ddd, MMM Do')}
            </Text>
            <Text style={styles.sub_header}>
              {strings('locations.timeline_text')}
            </Text>
            <List refreshLocations={this.fetchAddresses} />
            <MissingLocation />
            <Disclaimer />
          </>
        ) : (
          <Import
            date={date}
            visible={openImportModal}
            handleModalClose={() => {
              this.props.updateLocationData({
                openImportModal: true,
                isImporting: false,
                imported: true,
              });
              this.fetchAddresses(date);
            }}
          />
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  date: {
    fontSize: 18,
    lineHeight: 25,
    color: colors.module_title,
    padding: 20,
  },
  sub_header: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 25,
    textTransform: 'uppercase',
    color: colors.gray_icon,
    paddingHorizontal: 20,
  },
});

LocationsContainer.propTypes = {
  updateLocationData: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    contactLocationData: state.contactLocationReducer,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  updateLocationData,
}, dispatch);

const Locations = connectActionSheet(LocationsContainer);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Locations);
