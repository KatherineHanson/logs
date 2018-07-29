import './record-form.scss'
import React from 'react'
import * as util from '../../lib/util.js'

let emptyState = {
  description: '',
  descriptionDirty: false,
  descriptionError: 'Description is required',
  location: '',
  locationDirty: false,
  locationError: 'Location is required',
  category: '',
  categoryDirty: false,
  categoryError: '',
}

class RecordForm extends React.Component {
  constructor(props){
    super(props)
    this.state = props.record ? {...emptyState, ...props.record} : emptyState
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleValidate = this.handleValidate.bind(this)
  }

  handleChange(e){
    let {name, value} = e.target
    this.setState({
      [name]: value,
      [name+'Dirty']: true,
      [name+'Error']: this.handleValidate(e.target),
    })
  }

  handleSubmit(e){
    e.preventDefault()

    if (!this.state.description)
      this.setState({descriptionDirty: true})
    if (!this.state.location)
      this.setState({locationDirty: true})

    if (this.state.description && this.state.location) {
      this.props.onComplete(this.state)
      this.setState(emptyState)
    }
  }

  handleValidate({type, placeholder, value}){
    switch(type){
      case 'text':
        if(value.length === 0)
          return placeholder + ' is required'
        return null
      default:
        return null
    }
  }

  render(){
    return (
      <form
        className='record-form'
        onSubmit={this.handleSubmit}>
        <div className='form-field'>
          <input
            type='text'
            id='description'
            name='description'
            value={this.state.description}
            onChange={this.handleChange}
            placeholder='Description'
          />
          <span className='warning'>*</span>
          {util.renderIf(this.state.descriptionDirty,
            <label className='warning-label' htmlFor='description'>{this.state.descriptionError}</label>
          )}
        </div>
        <div className='form-field'>
          <input
            type='text'
            id='category'
            name='category'
            value={this.state.category}
            onChange={this.handleChange}
            placeholder='Category'
          />
        </div>
        <div className='form-field'>
          <input
            type='text'
            id='location'
            name='location'
            value={this.state.location}
            onChange={this.handleChange}
            placeholder='Location'
          />
          <span className='warning'>*</span>
          {util.renderIf(this.state.locationDirty,
            <label className='warning-label' htmlFor='location'>{this.state.locationError}</label>
          )}
        </div>
        <div className='form-field button-field'>
          <button type='submit'>{this.props.record ? 'Update' : 'Create'} </button>
        </div>
      </form>
    )
  }
}

export default RecordForm
