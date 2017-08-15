import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Container, Row, Col } from 'react-grid-system'
import { FlatButton, List, Subheader, Divider, CircularProgress } from 'material-ui'

import EventItem from './EventItem'
import ConfirmDialog from './ConfirmDialog'

import { fetchEventsIfNeeded, createEvent, openDialog, changePage } from '../actions'

import { Form, TextField } from './Forms'

const FORM_NAME = 'newEventForm'

class Events extends Component {
  constructor(props){
    super(props)
    this.state = {
      eventError: '',
      deleteConfirmation: false,
      deleteCallback: () => {}
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.selectEvent = this.selectEvent.bind(this)
    this.deleteEvent = this.deleteEvent.bind(this)
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(changePage('Events'))
    dispatch(fetchEventsIfNeeded(res => {
      if(res && !res.success){
        this.props.history.push('/login')
      }
    }))
  }

  handleSubmit(payload) {
    this.props.dispatch(createEvent({name: payload.name}, (json)=> {
      if(!json.success){
        this.setState({
          eventError: json.eventError
        })
      }
    }))
  }

  selectEvent(id){
    this.props.history.push(`/event/${id}`)
  }

  deleteEvent(cb){
    this.setState({
      deleteCallback: cb
    }, () => {
      this.props.dispatch(openDialog())
    })
  }

  formSubmit = null

  render() {
    const { events, isFetching, user } = this.props
    return (
      <Container xs={true}>
        <Row>
          <Col offset={{sm: 0, md: 1, lg: 2}} sm={12} md={10} lg={8}>
            <List style={{ opacity: isFetching ? 0.5 : 1 }}>
              <Subheader>Events</Subheader>
              {isFetching && events.length === 0 &&
                <CircularProgress />
              }
              {!isFetching && events.length === 0 &&
                <div>
                  <p>No Events yet.</p>
                  <p>Create your first by assigning the name below</p>
                </div>
              }
              { Array.isArray(events) && events.map((event, i) => 
                <EventItem 
                  key={event._id} 
                  event={event} 
                  selectEvent={this.selectEvent} 
                  deleteEvent={this.deleteEvent}
                  user={user}
                />
              )}
            </List>
            <ConfirmDialog 
              proceedCallback={this.state.deleteCallback} 
              contentText="Are you sure you want to delete this item?" 
            />
            <Divider />
            <Form onSubmit={this.handleSubmit} name={FORM_NAME} resetOnSubmit={true} formSubmit={handler => this.formSubmit = handler}>
              <TextField
                hintText="Type new Event name"
                floatingLabelText="New Event"
                name="name"
                error={this.state.eventError}
                fullWidth={false}
                formName={FORM_NAME}
              />
              <FlatButton primary={true} label="Add" onTouchTap={() => this.formSubmit()} />
            </Form>
          </Col>
        </Row>
      </Container>
    )
  }
}

Events.propTypes = {
  events: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
  const {events, user} = state
  return {
    events: events.items,
    isFetching: events.isFetching,
    user
  }
}

export default connect(mapStateToProps)(Events)