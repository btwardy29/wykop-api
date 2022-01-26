import { createMachine } from "xstate";
import { assign } from "xstate";
import { doc, increment, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from "./firebase/config";

const invokeFetchWykopTag = async (context) => {
  const { wykopTag } = context
  const countRef = doc(db, 'counter', 'count')

  await updateDoc(countRef, { 'count': increment(1) })

  const query = await fetch(`https://a2.wykop.pl/tags/links/${wykopTag}/page/1/appkey/BhjCdIahWG`)
  const { data } = await query.json()
  console.log('data', data);
  return data.slice(0, 15)
  
}

export const wykopMachine = createMachine({
  id: 'wykop',
  initial: 'idle',
  context: {
    wykopTag: null,
    posts: null
  },
  states: {
    idle: {},
    selected: {
      initial: 'loading',
      states: {
        loading: {
          invoke: {
            id: 'fetch-wykopTag',
            src: invokeFetchWykopTag,
            onDone: {
              target: 'loaded',
              actions: assign({
                posts: (context, event) => event.data
              })
            },
            onError: 'failed'
          }
        },
        loaded: {},
        failed: {}
      }
    }
  },
  on: {
    SELECT: {
      target: '.selected',
      actions: assign({
        wykopTag: (context, event) => event.name
      })
    }
  }
})