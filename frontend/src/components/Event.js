import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Invites from './Invites'
import Drops from './Drops'

import { fetchEvent, acceptInvite, changePage } from '../actions'

import { Container, Row, Col } from 'react-grid-system'
import { List, Subheader, Divider, Chip, CircularProgress, FlatButton } from 'material-ui'

class Event extends Component {
  constructor(props){
    super(props)
    this.state = {
      eventId: this.props.match.params.eventId,
      inviteId: this.props.match.params.inviteId      
    }
  }

  getEvent(){
    const { dispatch } = this.props
    dispatch(fetchEvent(this.state.eventId, res => {
      if(res && res.redirect){
        this.props.history.push(res.success ?  res.redirect : '/login')
      }
    }))
  }

  componentDidUpdate() {
    this.props.dispatch(changePage('Event - ' + this.props.event.name))
  }

  componentDidMount() {
    const { dispatch } = this.props
    if(this.state.inviteId){
      dispatch(acceptInvite(this.state.inviteId, this.state.eventId, (res)=>{
        this.props.history.push(res.success ?  `/event/${this.state.eventId}` : res.redirect === true ? '/login' : res.redirect)
        if(res.success){
          this.getEvent()
        }
      }))
    }else{
      this.getEvent()
    }
  }

  render() {
    const { event } = this.props
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
      <Container xs={true}>
        <Row>
          <Col offset={{sm: 0, md: 1, lg: 2}} sm={12} md={10} lg={8}>
          {event.isFetching &&
            <CircularProgress />
          }
          {!event.isFetching &&
            <div>
              <FlatButton 
                fullWidth={false} 
                label="Back to events" 
                primary={true}
                onTouchTap={()=>this.props.history.push('/events')} 
              />
              <h3>{event.name}</h3>
              <List></List>
              <Drops drops={event.drops} event={event} users={event.users} />
              <Divider />
              <Subheader>Contributors:</Subheader>
              <div style={styles.chipWrapper}>
              {event.users && event.users.map((user, i) => 
                <Chip key={i} style={styles.chip}>
                  {user.name}
                </Chip>
              )}
              </div>
              <Divider />
              <Invites eventId={event._id} invites={event.invites} inviteUrl history={this.props.history} />
            </div>
          }
          </Col>
        </Row>
      </Container>
    )
  }
}

Event.propTypes = {
  event: PropTypes.object
}

function mapStateToProps(state) {
  const {event} = state
  return {
    event
  }
}

Event = connect(mapStateToProps)(Event)
export default Event