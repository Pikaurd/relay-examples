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
  createRefetchContainer,
  graphql,
} from 'react-relay'

import TodoItem from './TodoItem'


class TodoList extends Component<{}> {
  render() {
    return (
      <FlatList
        data={this.props.viewer.todos.edges}
        keyExtractor={ (item, index) => item.cursor }
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
})

export default createFragmentContainer(TodoList, {
  viewer: graphql`
    fragment TodoList_viewer on User {
      todos(
        first: 2147483647  # max GraphQLInt
      ) @connection(key: "TodoList_todos") {
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
})
