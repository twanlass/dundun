import { connect } from 'react-redux'
import Sidebar from '../../components/sidebar/sidebar.js'
import {getLists} from '../../actionCreators/getLists.js';
import {setActiveList} from '../../actionCreators/setActiveList.js';

const mapStateToProps = state => {
  return {
    lists: state.lists,
    listOrder: state.listOrder,
    todayBadgeCount: state.state.todayBadgeCount,
    activeList: state.state.activeList
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getLists: () => { dispatch(getLists()) },
    setActiveList: id => { dispatch(setActiveList(id)) }
  }
}

const SidebarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar)

export default SidebarContainer
