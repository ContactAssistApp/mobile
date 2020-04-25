import React, {Component} from 'react';
import TraceTool from './TraceTool';

class Notification extends Component {
  constructor(props) {
    super();
    this.state = {
      notification: false,
    };
  }

  updateSetting = state => {
    this.setState({
      notification: state,
    });
  };

  render() {
    return (
      <TraceTool
        iconName={'alert24'}
        title={'Notifications'}
        description={'Recieve notifications for local alerts and updates.'}
        toggleValue={this.state.notification}
        handleToggle={this.updateSetting}
      />
    );
  }
}

export default Notification;
