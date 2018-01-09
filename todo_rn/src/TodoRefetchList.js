import React, { Component } from 'react'
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from 'react-native'

import {
  QueryRenderer,
  createRefetchContainer,
  graphql,
} from 'react-relay'

import TodoItem from './TodoItem'


class TodoRefetchList extends Component<{}> {
  constructor(props) {
    super(props)
    this._isLoadingMore = false
    this.state = {
      isFetching: false,
    }
    console.log('TodoRefetchList.constructor.props: ', props);
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  componentWillReceiveProps(nextProps) {
    console.log('next props: ', nextProps);
  }

  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   console.log('shouldComponentUpdate nextProps: ', nextProps)
  //   console.log('shouldComponentUpdate nextState: ', nextState)
  //
  //   console.log('props compare: ', nextProps.viewer.todos.edges == this.props.viewer.todos.edges);
  //   console.log('state compare: ', nextState == this.state);
  //   return false
  // }

  render() {
    console.log('render: ', this.props.viewer.todos.edges.length)
    let data = this.props.viewer.todos.edges
    // let data = []

    return (
      <FlatList
        data={data}
        keyExtractor={ (item, index) => item.cursor }
        onEndReached={ () => this.loadMore() }
        onEndReachedThreshold={0.01}
        onRefresh={() => this.onRefresh()}
        refreshing={this.state.isFetching}
        renderItem={ item => this.renderItem(item) }
        style={ styles.container }
      />
    )
  }

  renderItem(row) {
    const { index, item } = row
    return (
      <TodoItem
        key={item.node.id}
        todo={item.node}
        viewer={this.props.viewer}
      />
    )
  }

  onRefresh() {
    this.setState({isFetching: true})
    const refetchVariables = {
      count: 20,
      cursor: null
    }

    this.props.relay.refetch(
      refetchVariables,
      null,
      (error) => {
        this.setState({isFetching: false})

        console.log('onEndReached: ', error)
      },
      {
        force: true,
    })
  }

  loadMore() {
    console.log('load more')

    if (this._isLoadingMore) {
      console.log('skip load more. cause not finished')
      return
    }

    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return
    }

    this._isLoadingMore = true
    sleep(1000)

    const { todos } = this.props.viewer

    if (!todos.pageInfo.hasNextPage) return

    const { endCursor } = todos.pageInfo

    const total = todos.edges.length + 10
    const refetchVariables = {
      count: 10,
      cursor: endCursor,
    }
    const renderVariables = {
      count: total,
      cursor: endCursor,
    }

    console.log('refetch using: ', refetchVariables, ' renderVariables: ', renderVariables)
    this.props.relay.refetch(
      refetchVariables,
      renderVariables,
      (error) => {
        this._isLoadingMore = false
        console.log('onEndReached: ', error)
      },
      {
        force: false,
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
})

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

export default createRefetchContainer(TodoRefetchList, {
  viewer: graphql`
    fragment TodoRefetchList_viewer on User
    @argumentDefinitions(
      count: { type: "Int", defaultValue: 20 }
      cursor: { type: "String" }
    ) {
      todos(
        first: $count
        after: $cursor
      ) @connection(key: "TodoRefetchList_todos") {
        pageInfo {
          hasNextPage
          startCursor
          endCursor
        }
        edges {
          node {
            id,
            complete,
            ...TodoItem_todo,
          },
        },
      },
      id,
      totalCount,
      completedCount,
      ...TodoItem_viewer,
    }
  `,
},
graphql`
  query TodoRefetchList_Query($count: Int, $cursor: String) {
    viewer {
      ...TodoRefetchList_viewer @arguments(count: $count, cursor: $cursor)
    }
  }
`
)
