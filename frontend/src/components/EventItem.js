import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { toggleEvent, saveEvent, deleteEvent } from '../actions'

import { RaisedButton, ListItem, MenuItem, IconMenu, IconButton } from 'material-ui'
import { grey400 } from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { Form, TextField } from './Forms'

const FORM_NAME = 'eventItemForm'

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

const RightIconMenu = ({enableEdit, deleteEvent}) => (
  <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem onTouchTap={enableEdit}>Edit</MenuItem>
        <MenuItem onTouchTap={deleteEvent}>Delete</MenuItem>
      </IconMenu>
)

class EventItem extends Component {
  constructor(props){
    super(props)
    this.enableEdit = this.enableEdit.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
    this.save = this.save.bind(this)
    this.deleteEvent = this.deleteEvent.bind(this)
    this.selectEvent = this.selectEvent.bind(this)
  }

  enableEdit(e){
    e.preventDefault()
    const {dispatch, event} = this.props
    dispatch(toggleEvent(event._id, true))
  }

  cancelEdit(e){
    e.preventDefault()
    const {dispatch, event} = this.props
    dispatch(toggleEvent(event._id, false))
  }

  save(payload){
    const {dispatch, event} = this.props
    dispatch(saveEvent(event._id, {...event, name: payload.name}))
  }

  deleteEvent(){
    const {dispatch, event} = this.props
    this.props.deleteEvent(() => {
      dispatch(deleteEvent(event._id))
    })
  }

  selectEvent(){
    const {event} = this.props
    this.props.selectEvent(event._id)
  }

  formSubmit = null

  render() {
    const {event, user} = this.props
    return (
      <div>
        {event.edit && 
          <ListItem value={event._id}
            primaryText={
              <Form onSubmit={this.save} name={FORM_NAME} formSubmit={handler => this.formSubmit = handler}>
                <TextField
                  hintText="Enter new event name"
                  floatingLabelText={false}
                  validationError="Event name can't be blank"
                  name="name"
                  value={this.props.event.name}
                  fullWidth={false}
                  formName={FORM_NAME}
                />
                <RaisedButton label="Cancel" onTouchTap={this.cancelEdit} style={{margin: '0 12px'}} />
                <RaisedButton primary={true} label="Save" onTouchTap={()=> this.formSubmit()} />
              </Form>
            }
          />
        }
        {!event.edit && 
          <ListItem value={event._id}
            onTouchTap={this.selectEvent}
            primaryText={event.name}
            rightIconButton={event.owner === user._id ? 
              RightIconMenu({enableEdit: this.enableEdit, deleteEvent: this.deleteEvent}) :
              null}
          />
        }
      </div>
    )
  }
}

EventItem.propTypes = {
  event: PropTypes.object.isRequired
}

EventItem = connect()(EventItem)
export default EventItem