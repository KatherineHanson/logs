import './record-view.scss'
import React from 'react'
import {connect} from 'react-redux'
import RecordItem from '../record-item'
import RecordForm from '../record-form'
import * as record from '../../action/record.js'

class RecordView extends React.Component {
  constructor(props) {
    super(props)
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
      fetch,
    } = this.props

    return (
      <div className='record-view'>
        <h2 className='title'> Records </h2>
        {records.data.map((item, i) =>
          <RecordItem
            key={i}
            record={item}
          />
        )}
        <button onClick={fetch}>Refresh</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  records: state.records,
})

const mapDispatchToProps = (dispatch) => ({
  fetch: () => dispatch(record.fetch()),
})

export default connect(mapStateToProps, mapDispatchToProps)(RecordView)
