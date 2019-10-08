import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'src/components';
import { hideAlert } from 'src/state/actions/alerts';

class AlertContainer extends React.Component {
  render() {
    return (
      <Alert type={this.props.alertType} transition='popup' show={this.props.show} close={() => this.props.hideAlert()}>
        {this.props.type === 'danger' && <Icon>error</Icon>}
        {this.props.type === 'success' && <Icon>check_circle</Icon>}
        {this.props.content}
      </Alert>
    )
  }
}

export default connect(state => ({
  show: state.alerts.show,
  alertType: state.alerts.alertType,
  content: state.alerts.content,
}), {
  hideAlert
})
(AlertContainer)