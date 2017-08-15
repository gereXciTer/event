import React, { Component } from 'react'
import { connect } from 'react-redux'

import { createDrop, deleteDrop, saveDrop, openDialog } from '../actions'

import ConfirmDialog from './ConfirmDialog'

import { Container, Row, Col } from 'react-grid-system'
import { Paper, Divider, SelectField, MenuItem , FlatButton, RaisedButton, Subheader, FloatingActionButton, Chip,
  IconMenu, IconButton,
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui'
import ContentAdd from 'material-ui/svg-icons/content/add';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { grey400 } from 'material-ui/styles/colors';

import { Form, TextField } from './Forms'

const FORM_NAME = 'newDropForm'

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

const RightIconMenu = ({enableEdit, deleteDrop, drop}) => (
  <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem onTouchTap={() => {enableEdit(drop)}}>Edit</MenuItem>
        <MenuItem onTouchTap={() => {deleteDrop(drop)}}>Delete</MenuItem>
      </IconMenu>
)

class Drops extends Component {

  constructor(props){
    super(props)
    this.state = {
      errors: {
        name: false,
        amount: false
      },
      values: {
        id: null,
        name: '',
        amount: ''
      },
      users: [],
      deleteCallback: ()=>{},
      showDropForm: false
    }
    this.cancelDrop = this.cancelDrop.bind(this)
    this.showDropForm = this.showDropForm.bind(this)
    this.sendDrop = this.sendDrop.bind(this)
    this.deleteDrop = this.deleteDrop.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleSplitChange = this.handleSplitChange.bind(this)
    this.getUserList = this.getUserList.bind(this)
    this.toggleTotals = this.toggleTotals.bind(this)
  }

  cancelDrop(){
    this.setState({
      showDropForm: false
    })
  }

  toggleTotals(){
    this.setState(prevState => ({
      showTotals: !prevState.showTotals
    }))
  }

  getUserList(showCurrent = true){
    const { event, user } = this.props;
    let userList = event.users && event.users.concat(event.invites);

    if(userList && !showCurrent){
      userList = userList.filter(u => u._id !== user._id)
    }
    return userList || []
  }

  showDropForm(drop){
    if(drop && drop._id){
      const users = this.getUserList(false)
      let splits = drop.split && drop.split.map(split => {
        return users.find(u => u._id === (split.user || split.invite)._id)
      })
      this.setState({
        showDropForm: true,
        values: {
          id: drop._id,
          name: drop.name,
          amount: String(drop.amount),
          split: drop.split.map(split => split.event ? {invite: split.invite._id} : {user: split.user._id})
        },
        users:  splits
      })
    }else{
      this.setState({
        showDropForm: true,
        values: {
          id: null,
          name: '',
          amount: ''
        },
        users:  []
      })
    }
  }

  handleNameChange(e) {
    const value = e.target.value
    this.setState(prevState => ({
      values: {...prevState.values,
        name: value
      }
    }))
  }

  handleAmountChange(e) {
    const value = e.target.value
    this.setState(prevState => ({
      values: {...prevState.values,
        amount: value
      }
    }))
  }

  handleSplitChange(e, i, values){
    this.setState(prevState => ({
      users: values,
      values: {...prevState.values,
        split: values.map(value => value.event ? {invite: value._id} : {user: value._id})
      }
    }))
  }

  sendDrop(payload) {
    const action = this.state.values.id ? saveDrop : createDrop
    const values = {
      ...this.state.values,
      ...payload,
      owner: this.props.user._id,
      event: this.props.event._id
    }
    console.log(values)
    this.props.dispatch(action(values, res => {
      this.setState({
        values: {
          name: ' ',
          amount: ' '
        },
        showDropForm: false,
        users: []        
      })
    }))
  }

  deleteDrop(id) {
    this.setState({
      deleteCallback: ()=> {
        this.props.dispatch(deleteDrop(id))
        this.cancelDrop()
      }
    }, () => {
      this.props.dispatch(openDialog())
    })
  }

  calculateTotal(){
    const { drops } = this.props
    const users = this.getUserList()
    let spread = []

    function updateSpread(user, name, oweTo, amount){
      if(user === oweTo){
        return
      }
      //removing two-direction transfers
      let reverseSpread = spread.find(s => s.user === oweTo && s.oweTo === user)
      if(reverseSpread && reverseSpread.amount < amount){
        //removing less owed amount, reducing user's debt
        amount -= reverseSpread.amount
        spread = spread.filter(s => s !== reverseSpread)
      }else if(reverseSpread){
        //reduce owed amount, canceling user's debt
        reverseSpread.amount -=  amount
        return
      }

      let existingSpread = spread.find(s => s.user === user && s.oweTo === oweTo)
      if(existingSpread) {
        existingSpread.amount = parseFloat(existingSpread.amount) + parseFloat(amount)
      }else{
        spread.push({
          user,
          name,
          oweTo,
          amount
        })
      }
    }

    drops.forEach(drop => {
      const dropOwnerId = drop.owner._id || drop.owner
      if(!drop.split || !drop.split.length){
        let amount = drop.amount/users.length
        users.forEach(u => {
          updateSpread(u._id, u.name || u.email, dropOwnerId, amount)
        })
      }else{
        let amount = drop.amount/(drop.split.length + 1)
        drop.split.forEach(split => {
          let user = (split.user || split.invite)
          updateSpread(user._id, user.name || user.email, dropOwnerId, amount)
        })
      }
    })
    
    //reducing number of transfers
    spread.forEach(spreadItem => {
      let {user, oweTo, amount} = spreadItem
      let reverseSpread = spread.find(s => s.user === oweTo && spread.some(s2 => s2.user === user && s.oweTo === s2.oweTo))
      if(reverseSpread && reverseSpread.amount < amount){
        //removing less owed amount, reducing user's debt
        spreadItem.amount -= reverseSpread.amount
        spread = spread.filter(s => s !== reverseSpread)
      }else if(reverseSpread){
        let secondSpread = spread.find(s => s.user === user && reverseSpread.oweTo === s.oweTo)
        //reduce owed amount, canceling user's debt
        reverseSpread.amount -=  amount
        spreadItem.amount -= amount
        secondSpread.amount += parseFloat(amount)
      }
    })

    return spread.map(s => {
      return {...s,
        amount: Math.round(s.amount * 100)/100,
        oweTo: users.find(u => u._id === s.oweTo)
      }
    })
    .filter(s => s.amount !== 0)
    .sort((a, b) => a.user === b.user ? 0 : a.user > b.user ? 1 : -1)
  }

  formSubmit = null
  
  render() {
    const { drops, user } = this.props
    const styles = {
      chip: {
        margin: 4,
      },
      chipWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    }
    const users = this.getUserList(false)
    const totals = this.calculateTotal()
    const youOwe = totals.filter(s => s.user === user._id)

    return (
      <Paper style={{position: 'relative'}}>

        <Subheader>List:</Subheader>
        <Table selectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Title</TableHeaderColumn>
              <TableHeaderColumn style={{width: 50}}>Amount</TableHeaderColumn>
              <TableHeaderColumn>Split Between</TableHeaderColumn>
              <TableHeaderColumn style={{width: 20}}></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
            >
          {!(drops && drops.length) &&
            <TableRow>
              <TableRowColumn>
                nothing yet
              </TableRowColumn>
            </TableRow>
          }
          {drops && drops.map((drop, i) => drop &&
            <TableRow key={drop._id} displayBorder={i < drops.length - 1}>
              <TableRowColumn>{drop.owner && drop.owner.name}</TableRowColumn>
              <TableRowColumn>{drop.name}</TableRowColumn>
              <TableRowColumn style={{width: 50}}>{drop.amount}</TableRowColumn>
              <TableRowColumn>
                <div style={styles.chipWrapper}>
                {drop.split && drop.split.map((split, i) => 
                  <Chip key={i} style={styles.chip}>
                    {split.user && split.user.name}
                    {split.invite && split.invite.email}
                  </Chip>
                )}
                </div>
              </TableRowColumn>
              <TableRowColumn style={{width: 20}}>{drop.owner._id === user._id ? 
                RightIconMenu({drop, enableEdit: this.showDropForm, deleteDrop: ()=>{this.deleteDrop(drop._id)}}) :
                null}</TableRowColumn>
            </TableRow>
          )}
          </TableBody>
        </Table>

        <ConfirmDialog 
          proceedCallback={this.state.deleteCallback} 
          contentText="Are you sure you want to delete this item?" 
        />

        <Divider style={{marginTop: 20}} />

        {!this.state.showDropForm && 
          <FloatingActionButton mini={true} onTouchTap={this.showDropForm} style={{position: 'absolute', right: 0, bottom: -20}}>
            <ContentAdd />
          </FloatingActionButton>
        }

        <Subheader>You owe:
          {(!youOwe || !youOwe.length) &&
            <span>
              &nbsp;nothing
            </span>
          }
        </Subheader>
        
        {youOwe && youOwe.length > 0 && youOwe.map((spread, i) => 
          <div key={i} style={styles.chipWrapper}>
            <span style={{padding: 10}}> ${spread.amount} </span>
            <span style={{padding: 10}}> => </span>
            <Chip style={styles.chip}>{spread.oweTo.name || spread.oweTo.email}</Chip>
          </div>
        )}
        <FlatButton primary={true} 
          label={this.state.showTotals ? "Hide All" : "Show All"} 
          onTouchTap={this.toggleTotals} />
        {this.state.showTotals && totals && totals.map((spread, i) =>
          <div key={i} style={styles.chipWrapper}>
            <Chip style={{...styles.chip, display: 'inline-block'}}>{spread.name}</Chip>
            <span style={{padding: 10}}> => </span>
            <Chip style={styles.chip}>{spread.oweTo.name || spread.oweTo.email}</Chip>
            <span style={{padding: 10}}> = </span>
            <span style={{padding: 10}}> ${spread.amount} </span>
          </div>
        )}

        {this.state.showDropForm &&
          <Form onSubmit={this.sendDrop} name={FORM_NAME} resetOnSubmit={true} formSubmit={handler => this.formSubmit = handler}>
            <Subheader>Add spending:</Subheader>
            <Container>
              <Row>
                <Col sm={6}>
                  <TextField
                    style={{marginRight: 12}}
                    hintText="Type the title"
                    floatingLabelText="Title"
                    errorText={this.state.errors.name}
                    value={this.state.values.name}
                    name="name"
                    fullWidth={true}
                    formName={FORM_NAME}
                  />
                </Col>
                <Col sm={6}>
                  <TextField
                    hintText="Type the amount"
                    floatingLabelText="Amount"
                    errorText={this.state.errors.amount}
                    value={this.state.values.amount}
                    name="amount"
                    fullWidth={true}
                    formName={FORM_NAME}
                  />
                </Col>
              </Row>
              <Row>
                <Col  sm={6}>
                  {users.length > 0 && 
                    <SelectField
                      multiple={true}
                      hintText="Select to split"
                      value={this.state.users}
                      fullWidth={true}
                      onChange={this.handleSplitChange}
                    >
                      {users.map(user=>
                        <MenuItem 
                          key={user._id}
                          insetChildren={true}
                          checked={this.state.users && this.state.users.some(u=>u._id===user._id)}
                          value={user}
                          primaryText={user.name || user.email}
                        />
                      )}
                    </SelectField>
                  }
                </Col>
                <Col sm={6} style={{minHeight: 60}}>
                  <FlatButton primary={true} label="Cancel" onTouchTap={this.cancelDrop} style={{float: 'right'}} />
                  <RaisedButton primary={true} label={this.state.values.id ? "Save" : "Add"} 
                    onTouchTap={() => this.formSubmit()} style={{float: 'right'}} />
                </Col>
              </Row>
            </Container>
          </Form>
        }
      </Paper>
    )
  }
}

function mapStateToProps(state) {
  const {user} = state
  return {
    user
  }
}

Drops = connect(mapStateToProps)(Drops)
export default Drops