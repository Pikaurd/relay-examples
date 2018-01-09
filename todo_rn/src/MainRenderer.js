import React, { Component } from 'react'
import {
  Platform,
  View,
} from 'react-native'

import {
  QueryRenderer,
  graphql,
} from 'react-relay'

import modernEnvironment from './RelayEnvironment'
import TodoApp from './TodoApp'


class MainRenderer extends Component<{}> {
  render() {
    return (
      <QueryRenderer
        environment={modernEnvironment}
        query={graphql`
          query MainRenderer_Query {
            viewer {
              id
              ...TodoApp_viewer
            }
          }
        `}
        variables={{}}
        render={({error, props}) => {
          if (props) {
            console.log('props: ', props)
            return <TodoApp viewer={props.viewer} />;
          } else {
            return <View style={{flex:1, backgroundColor: 'pink'}} />
          }
        }}
      />
    )
  }
}

export default MainRenderer
