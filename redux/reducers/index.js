import { combineReducers } from 'redux'
import { user } from './user'

const Reducers = combineReducers({
  useState: user,
})

export default Reducers
