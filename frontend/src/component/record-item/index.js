import './record-item.scss'
import React from 'react'
import RecordForm from '../record-form'
import * as util from '../../lib/util'
import * as Record from '../../action/record'

class RecordItem extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      editing: false,
    }

    this.handleUpdate = this.handleUpdate.bind(this)
  }

  handleUpdate(record){
    this.props.recordUpdate(record)
    this.setState({editing: false})
  }

  render(){
    let {
      record,
      destroyRecord,
    } = this.props
    return (
      <div className='record-item'>
        <div>
          { !this.state.editing ?
            <div>
              <p><strong>Description:</strong> {record.description}</p>
              <p><strong>Location:</strong> {record.location}</p>
              <p><strong>Category:</strong> {record.category}</p>
              <p><strong>Date/Time:</strong> {record.created}</p>
              {util.renderIf(destroyRecord,
                <div>
                  <button className='delete' onClick={() => destroyRecord(record)}>Delete</button>
                  <button className='edit' onClick={() => this.setState({editing: true})}>Edit</button>
                </div>
              )}
            </div>
            :
            <div>
              <RecordForm record={record} onComplete={this.handleUpdate} />
              <p>
                <button onClick={() => this.setState({editing: false})}>
                Cancel
                </button>
              </p>
            </div>
          }
        </div>
      </div>
    )
  }
}


export default RecordItem
