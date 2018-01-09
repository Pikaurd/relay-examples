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

import TodoList from './TodoList'
import TodoRefetchList from './TodoRefetchList'
import TodoPaginationList from './TodoPaginationList'


class TodoApp extends Component<{}> {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Todo App</Text>
        <TodoPaginationList viewer={this.props.viewer} />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
})

export default createFragmentContainer(TodoApp, {
  viewer: graphql`
    fragment TodoApp_viewer on User {
      id,
      totalCount,
#     ...TodoList_viewer,
#     ...TodoRefetchList_viewer,
      ...TodoPaginationList_viewer,
    }
  `,
})
