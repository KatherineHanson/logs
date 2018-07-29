import './header.scss'
import React from 'react'
import { log } from 'util'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as util from '../../lib/util.js'
import * as auth from '../../action/auth.js'
import { renderIf } from '../../lib/util.js'

class Header extends React.Component {

  render() {
    let { loggedIn } = this.props

    return (
      <header>
        <div className='inner'>
          <h1><Link to='/'>Witnesby</Link></h1>
          {util.renderIf(!loggedIn,
            <nav className='navbar'>
              <ul className='signingInSection'>
                <li><Link className='button' to='/login'>Log In</Link></li>
                <li><Link className='button' to='/signup'>Sign Up</Link></li>
              </ul>
            </nav>
          )}

          {util.renderIf(loggedIn,
            <nav className='navbar'>
              <ul>
                <li><Link className='button' to='/admin/record'>Records</Link></li>
              </ul>

              <button className='logout-btn' onClick={this.props.logout}>logout</button>
            </nav>
          )}
          {util.renderIf(loggedIn,
            <nav className='navbar'>
              <ul className='signingInSection'>
                <button className='logout-btn' onClick={this.props.logout}>logout</button>
              </ul>
            </nav>
          )}
        </div>
      </header>
    )
  }
}

const mapStateToProps = (state) => ({
  loggedIn: !!state.token,
})

const mapDispatchToProps = (dispatch, props) => ({
  logout: () => {
    dispatch(auth.logout())
    props.history.push('/')
  },
})
export default connect(mapStateToProps, mapDispatchToProps)(Header)
