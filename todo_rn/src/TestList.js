// import React, { Component } from 'react'
// import {
//   FlatList,
//   Platform,
//   StyleSheet,
//   Text,
//   View,
//   SafeAreaView,
// } from 'react-native'
//
// import {
//   QueryRenderer,
//   createFragmentContainer,
//   createRefetchContainer,
//   graphql,
// } from 'react-relay'
//
// import modernEnvironment from './RelayEnvironment'
//
//
// class TestList extends Component<{}> {
//   render() {
//     return (
//       <SafeAreaView style={styles.container}>
//         <FlatList
//           style={styles.listContainer}
//           data={this.props.viewer.edges}
//           renderItem={ item => this.renderItem(item) }
//         />
//       </SafeAreaView>
//     )
//   }
//
//   renderItem(row) {
//     const { item, index } = row
//     console.log('item: ', item)
//     return <Text>{item.node.text}</Text>
//   }
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5FCFF',
//   },
//   listContainer: {
//     flex: 1,
//   },
// })
//
// //////
// class TestListRenderer extends Component<{}> {
//   render() {
//     return (
//       <QueryRenderer
//         environment={modernEnvironment}
//         query={graphql`
//           query TestList_Query {
//             viewer {
//               id
//               todos(first: 2147483647) {
//                 ...TestList_todos
//               }
//             }
//           }
//         `}
//         variables={{}}
//         render={({error, props}) => {
//           if (props) {
//             console.log('props: ', props)
//             return <TestList viewer={props.viewer.todos} />;
//           } else {
//             return <View style={{flex:1, backgroundColor: 'pink'}} />
//           }
//         }}
//       />
//     )
//   }
// }
//
// export default TestListRenderer
//
// /// ---- refetch
//
// const refetchTestListContainer = createFragmentContainer(TestList,
//   {
//     todos: graphql`
//       fragment TestList_todos on User
//       @connection(key: "TestList_xx")
//       @argumentDefinitions(first: $count, after: $cursor)
//       {
//         edges {
//           node {
//              __typename
//              id
//              complete
//              text
//           }
//           cursor
//         }
//       }
//     `
//   }
//   // ,
//   // graphql`
//   //   # Refetch query to be fetched upon calling 'refetch'.
//   //   # Notice that we re-use our fragment and the shape of this query matches our fragment spec.
//   //   # query TestList_Query ($count: Int) {
//   //   #   todos {
//   //   #     ...TestList_todos @arguments(count: $count)
//   //   #   }
//   //   # }
//   //   query TestList_Query($itemID: ID!) {
//   //     item: node(id: $itemID) {
//   //       ...TestList_todos
//   //     }
//   //   }
//   // `
// )
