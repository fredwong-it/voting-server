import {setEntries, next, vote, INITIAL_STATE} from './core';

export default function reducer(state = INITIAL_STATE, action) {
    
    // figure out which function to call it
    switch(action.type) {
        case 'SET_ENTRIES':
            return setEntries(state, action.entries);
        case 'NEXT':
            return next(state);
        case 'VOTE':
            //return vote(state, action.entry);
            // vote will only change voteState, so we need to update the vote in the state
            return state.update('vote',
                        voteState => vote(voteState, action.entry));
    }

    return state;
}