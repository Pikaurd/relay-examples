import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime'
import { installRelayDevTools } from 'relay-devtools'

const END_POINT = 'http://10.137.110.206:8080'

function fetchQuery(
  operation,
  variables,
) {
  return fetch(`${END_POINT}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json()
  })
}

installRelayDevTools()

const modernEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
})

export default modernEnvironment
