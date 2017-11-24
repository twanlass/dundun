import { connect } from 'react-redux'
import Nav from '../../components/nav/nav.js'

import {getLists} from '../../actionCreators/getLists.js';
import {setActiveList} from '../../actionCreators/setActiveList.js';

const mapStateToProps = state => {
  return {
    lists: state.lists,
    activeList: state.state.activeList
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getLists: () => { dispatch(getLists()) },
    setActiveList: id => { dispatch(setActiveList(id)) }
  }
}

const NavContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Nav)

export default NavContainer
