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
  createFragmentContainer,
  createPaginationContainer,
  graphql,
} from 'react-relay'

import TodoItem from './TodoItem'


class TodoPaginationList extends Component<{}> {
  render() {
    console.log('rendering')
    return (
      <FlatList
        data={this.props.viewer.todos.edges}
        keyExtractor={ (item, index) => item.cursor }
        renderItem={ item => this.renderItem(item) }
        style={ styles.container }
        onEndReached={ () => this._loadMore() }
        onEndReachedThreshold={0.01}
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

  _loadMore() {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return
    }

    this.props.relay.loadMore(
      10,  // Fetch the next 10 feed items
      error => {
        console.log(error);
      },
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
})

export default createPaginationContainer(TodoPaginationList, {
  viewer: graphql`
  fragment TodoPaginationList_viewer on User
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 20 }
    cursor: { type: "String" }
  ) {
    todos(
      first: $count
      after: $cursor
    ) @connection(key: "TodoPaginationList_todos") {
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
{
  direction: 'forward',
  getConnectionFromProps(props) {
    console.log('getConnectionFromProps: ', props);
    return props.viewer && props.viewer.todos
  },
  // This is also the default implementation of `getFragmentVariables` if it isn't provided.
  getFragmentVariables(prevVars, totalCount) {
    return {
      ...prevVars,
      count: totalCount,
    };
  },
  getVariables(props, {count, cursor}, fragmentVariables) {
    return {
      count,
      cursor,
    };
  },
  query: graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query TodoPaginationList_Query($count: Int, $cursor: String) {
      viewer {
        ...TodoPaginationList_viewer @arguments(count: $count, cursor: $cursor)
      }
    }
  `
})
