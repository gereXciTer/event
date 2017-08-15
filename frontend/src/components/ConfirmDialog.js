import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { openDialog } from '../actions'

import { FlatButton, Dialog } from 'material-ui'

class ConfirmDialog extends Component {
  constructor(props){
    super(props)
    this.dialogHandleClose = this.dialogHandleClose.bind(this)
    this.dialogHandleProceed = this.dialogHandleProceed.bind(this)
  }

  dialogHandleClose(){
    this.props.dispatch(openDialog(false))
  }

  dialogHandleProceed(){
    this.dialogHandleClose()
    this.props.proceedCallback()
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.dialogHandleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.dialogHandleProceed}
      />,
    ];
    return (
      <Dialog
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.dialogHandleClose}
      >
        {this.props.contentText}
      </Dialog>
    )
  }
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
  const {app} = state
  return {
    open: app.dialogOpen
  }
}

export default connect(mapStateToProps)(ConfirmDialog)