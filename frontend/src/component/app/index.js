import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'
import Dashboard from '../dashboard'
import Landing from '../landing'
import Record from '../record'
import RecordView from '../record-view'
import Header from '../header'
import * as util from '../../lib/util'

class App extends React.Component {
  componentWillMount() {
    console.log('THE PROPS', this.props)
  }

  render() {
    let { loggedIn } = this.props
    return (
      <div className='app'>
        <BrowserRouter>
          <div>
            <Route path='*' component={Header} />
            <main>
              <Route exact path='/' component={Landing} />
              <Route exact path='/signup' component={Landing} />
              <Route exact path='/login' component={Landing} />
              <Route exact path='/admin/record' component={Record} />
            </main>
          </div>
        </BrowserRouter>
      </div>
    )
  }
}

let mapStateToProps = (state) => ({
  loggedIn: !!state.token,
})

let mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
