import React, { PureComponent } from 'react'
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {
  QueryRenderer,
  createFragmentContainer,
  createRefetchContainer,
  graphql,
} from 'react-relay'

import TodoList from './TodoList'


class TodoItem extends PureComponent<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.todo.text}</Text>
        <Text>{`is complete: ${this.props.todo.complete}`}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    backgroundColor: '#F5FCFF',
  },
})

export default createFragmentContainer(TodoItem, {
  todo: graphql`
    fragment TodoItem_todo on Todo {
      complete,
      id,
      text,
    }
  `,
  viewer: graphql`
    fragment TodoItem_viewer on User {
      id,
      totalCount,
      completedCount,
    }
  `,
})
