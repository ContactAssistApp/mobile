import React, {Component} from 'react';
import {Button} from 'react-native';

class Home extends Component {
  trackBle = () => {
    console.log('==called==');
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

export default Home;
