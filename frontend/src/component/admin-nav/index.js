import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import * as auth from '../../action/auth.js'

class AdminNav extends React.Component {
  render() {
    return (
      <ul>
        <li><button onClick={this.props.logout}>logout</button></li>
      </ul>
    )
  }
}

const mapStateToProps = state => ({
  state,
})

const mapDispatchToProps = (dispatch) => ({
  logout: () => ispatch(auth.logout()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminNav)
