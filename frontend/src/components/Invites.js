import React, { Component } from 'react'
import { connect } from 'react-redux'

import { createInvite, deleteInvite, setLoginRedirect } from '../actions'

import { FlatButton, Subheader, Chip, MenuItem } from 'material-ui'

import { Form, AutoCompleteField } from './Forms'

const FORM_NAME = 'newInviteForm'

class Invites extends Component {

  constructor(props){
    super(props)
    this.state = {
      inviteError: false,
      inviteEmail: ''
    }
    this.sendInvite = this.sendInvite.bind(this)
    this.handleInviteDelete = this.handleInviteDelete.bind(this)
    this.handleInviteTap = this.handleInviteTap.bind(this)
  }

  handleInviteDelete(invite) {
    this.props.dispatch(deleteInvite(invite._id))
  }
  
  handleInviteTap(invite) {
    this.setState({
      inviteUrl: `/event/${invite.event}/${invite._id}`
    })
  }

  sendInvite(payload) {
    this.props.dispatch(createInvite({
      email: payload.inviteEmail,
      event: this.props.eventId
    }, (res) => {
      if(res.success){
        this.setState({
          inviteUrl: `/event/${res.event}/${res._id}`,
          inviteEmail: ''
        })
      }else if(res.redirect){
        this.props.dispatch(setLoginRedirect(`/event/${this.props.eventId}`))
        this.props.history.push('/login')
      }

    }))
  }

  formSubmit = null
  
  render() {
    const { invites, user } = this.props
    const styles = {
      chip: {
        margin: 4,
      },
      chipWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    };
    return (
      <div>
        <Subheader>Invite people:</Subheader>
        <div style={styles.chipWrapper}>
        {invites && invites.map(invite => {
          const inviteHandlers = {}
          if(this.props.user._id === invite.owner){
            inviteHandlers.onRequestDelete = () => { this.handleInviteDelete(invite) }
            inviteHandlers.onTouchTap = () => {  this.handleInviteTap(invite) }
          }
          return (
            <Chip 
              {...inviteHandlers}
              key={invite._id}
              style={styles.chip}
            >
              {invite.email}
            </Chip>
          )
        })}
        </div>
        {this.state.inviteUrl &&
          <div>Copy this <a href={this.state.inviteUrl}>link to invite</a> and send directly if needed</div>
        }
        <Form onSubmit={this.sendInvite} name={FORM_NAME} resetOnSubmit={true} formSubmit={handler => this.formSubmit = handler}>
          <AutoCompleteField
            hintText="Type email address"
            floatingLabelText="Recipient Email"
            errorText={this.state.inviteError}
            name="inviteEmail"
            fullWidth={false}
            value={this.state.inviteEmail}
            formName={FORM_NAME}
            validateOnChange={false}
            validator="email"
            dataSource={user.friends && user.friends.map(u=>{
                return {text: u.email, value: (
                  <MenuItem
                    primaryText={u.email}
                    secondaryText={u.name}
                  />
                )}
              })}
           />
          <FlatButton primary={true} label="Send" onTouchTap={() => this.formSubmit()} />
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {user} = state
  return {
    user
  }
}

Invites = connect(mapStateToProps)(Invites)
export default Invites