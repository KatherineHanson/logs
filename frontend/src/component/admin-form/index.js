import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import * as util from '../../lib/util.js'
import validator from 'validator'
const crypto = require('crypto')
const buf = crypto.randomBytes(256).toString('hex')
const CryptoJS = require('crypto-js')
let encrypted = CryptoJS.AES.encrypt(buf, 'Secret Passphrase').toString()

let emptyState = {
  accountName: '',
  accountNameDirty: false,
  accountNameError: 'Recovery Key is required',
  email: '',
  emailDirty: false,
  emailError: 'Email is required',
  password: '',
  passwordDirty: false,
  passwordError: 'Password is required',
  submitted: false,
}

class AdminForm extends React.Component {
  constructor(props){
    super(props)
    this.state = emptyState
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.validateChange = this.validateChange.bind(this)
  }

  validateChange(name, value){
    if(this.props.type === 'login')
      return null
    switch (name) {
      case 'email':
        if(!validator.isEmail(value))
          return 'you must provide a valid email'
        return null
      case 'password':
        if(value.length < 8)
          return 'Password must be 8 characters long'
        if(!validator.isAlphanumeric(value))
          return 'Password may only contain numbers and letters'
        return null
      default:
        return null
    }
  }

  handleChange(event){
    let { name, value } = event.target
    this.setState({
      [name]: value,
      [`${ name }Dirty`]: true,
      [`${ name }Error`]: this.validateChange(name, value),
    })
  }

  handleSubmit(event){
    event.preventDefault()
    let { accountNameError, emailError, passwordError } = this.state
    if(this.props.type !== 'login' && !accountNameError && !emailError && !passwordError){
      this.props.onComplete(this.state)
        .then(() => {
          if (this.props.loggedIn)
            this.props.history.push('/admin/record')
        })
      this.setState(emptyState)
    } else if (this.props.type === 'login'){
      this.props.onComplete(this.state)
        .then(() => {
          if (this.props.loggedIn)
            this.props.history.push('/admin/record')
        })
      this.setState(emptyState)
    } else {
      this.setState({
        accountNameDirty: true,
        emailDirty: true,
        passwordDirty: true,
        submitted: true,
      })
    }
  }

  handleClick(event){
    alert (encrypted.slice(0,100));
  }

  render(){
    let { type } = this.props

    type = type === 'login' ? type : 'signup'

    return (
      <form
        className='admin-form'
        noValidate
        onSubmit={ this.handleSubmit } >

        {util.renderIf(type !== 'login',
          <div>
            <button onClick={ this.handleClick }>View Recovery Key</button>
            <p></p>
          </div>
        )}

        {util.renderIf(type !== 'login',
          <div className='form-field'>
            <input
              id='accountName'
              name='accountName'
              placeholder='Recovery Key'
              type='text'
              value={ this.state.accountName }
              onChange={ this.handleChange }
            />
            <span className='warning'>*</span>
            {util.renderIf(this.state.accountNameDirty,
              <label className='warning-label' htmlFor='accountName'>{ this.state.accountNameError }</label>)}
          </div>
        )}

        <div className='form-field'>
          <input
            id='email'
            name='email'
            placeholder='Email'
            type='email'
            value={ this.state.email }
            onChange={ this.handleChange }
          />
          {util.renderIf(type === 'signup',
            <span className='warning'>*</span>)}
          {util.renderIf(this.state.emailDirty,
            <label className='warning-label' htmlFor='email'>{ this.state.emailError }</label>)}
        </div>

        <div className='form-field'>
          <input
            id='password'
            name='password'
            placeholder='Password'
            type='password'
            value={this.state.password}
            onChange={this.handleChange}
          />
          {util.renderIf(type === 'signup',
            <span className='warning'>*</span>)}
          {util.renderIf(this.state.passwordDirty,
            <label className='warning-label' htmlFor='password'>{ this.state.passwordError }</label>)}
        </div>
        <div className='form-field button-field'>
          <button type='submit'> { type } </button>
        </div>

      </form>
    )
  }
}

const mapStateToProps = (state) => ({loggedIn: !!state.token})

export default connect(mapStateToProps)(AdminForm)
