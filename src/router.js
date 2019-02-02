import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'

import App from './pages/App'
import H404 from './pages/Http404'
import Connections from './pages/Connections' // 如果要增加页面，在这里import之后，在下面JSX里写
import Test from './pages/test'

const BasicExample = () => (
  <Router>
    <Switch>
      <Route exact path='/' component={App} />
      <Redirect from='/old-match' to='/will-match' />
      <Route path='/connections' component={Connections} />
      <Route path='/test' component={Test} />
      <Route path='/topics' component={Topics} />
      <Route component={H404} />
    </Switch>
  </Router>
)

const Topics = (data) => {
  console.log(data)
  const { match } = data
  return (
    <div>
      <h2>Topics</h2>
      <ul>
        <li>
          <Link to={`${match.url}/rendering`}>Rendering with React</Link>
        </li>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
        </li>
      </ul>

      <Route path={`${match.path}/:topicId`} component={Topic} />
      <Route
        exact
        path={match.path}
        render={() => <h3>Please select a topic.</h3>}
      />
    </div>
  )
}

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)

export default BasicExample
