import makeStore from './src/store';
import startServer from './src/server';

export const store = makeStore();
startServer(store);

store.dispatch({
    actions: 'SET_ENTRIES',
    entries: required('./entries.json')
});

store.dispatch({
    actions: 'NEXT'
});