import './record.scss'
import React from 'react'
import {connect} from 'react-redux'
import RecordItem from '../record-item'
import RecordForm from '../record-form'
import * as record from '../../action/record'

class Record extends React.Component {
  constructor(props) {
    super(props)

    this.updateComponent = this.updateComponent.bind(this)
    this.destroyRecord = this.destroyRecord.bind(this)
    this.recordUpdate = this.recordUpdate.bind(this)
  }

  updateComponent(data) {
    this.props.submit(data)
      .then(() => {
        this.forceUpdate()
      })
  }

  recordUpdate(record) {
    this.props.update(record)
      .then(() => {
        this.forceUpdate()
      })
  }

  destroyRecord(record) {
    this.props.destroy(record)
      .then(() => {
        this.forceUpdate()
      })
  }

  componentWillMount() {
    this.props.fetch()
      .then(() => {
        this.forceUpdate()
      })
  }

  render(){
    let {
      records,
      removeRecord,
      updateRecord,
    } = this.props
    //let {editing} = this.props
    return (
      <div className='record'>
        <h1> Records </h1>
        <RecordForm onComplete={this.updateComponent}/>
        {records.data.map((item, i) =>
          <RecordItem
            key={i}
            record={item}
            destroyRecord={this.destroyRecord}
            recordUpdate={this.recordUpdate}
          />
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  records: state.records,
})

const mapDispatchToProps = (dispatch) => ({
  submit: (data) => dispatch(record.create(data)),
  fetch: () => dispatch(record.fetch()),
  destroy: (data) => dispatch(record.destroy(data)),
  update: (data) => dispatch(record.update(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Record)
