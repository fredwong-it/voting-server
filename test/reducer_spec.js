import {Map, fromJS} from 'immutable';
import {expect} from 'chai';
import reducer from '../src/reducer';

describe('reducer', () => {

    it('handles SET_ENTRIES', () => {
        const state = Map();
        const action = {type: 'SET_ENTRIES', entries: ['book', 'apple']};
        const nextState = reducer(state, action);

        expect(nextState).to.equal(fromJS({
            entries: ['book', 'apple']
        }));
    });

    it('handles NEXT', () => {
        const state = fromJS({
            entries: ['book', 'apple', 'car']
        });
        const action = {type: 'NEXT'};
        const nextState = reducer(state, action);

        expect(nextState).to.equal(fromJS({
            vote: {
                pair: ['book', 'apple']
            },
            entries: ['car']
        }));

    });

    it('handles VOTE', () => {
        const state = fromJS({
            vote: {
                pair: ['book', 'apple'],
                tally: {
                    'book': 2,
                    'apple': 4
                }
            },
            entries: ['car']
        });
        const action = {type: 'VOTE', entry: 'book'};
        const nextState = reducer(state, action);

        expect(nextState).to.equal(fromJS({
            vote: {
                pair: ['book', 'apple'],
                tally: {
                    'book': 3,
                    'apple': 4
                }
            },
            entries: ['car']
        }));
    });

    it('has an initial state', () => {
        const action = {type: 'SET_ENTRIES', entries: ['book', 'apple']};
        const nextState = reducer(undefined, action);

        expect(nextState).to.equal(fromJS({
            entries: ['book', 'apple']
        }));
    });

    it('can be used with reduce', () => {
        const actions = [
            {type: 'SET_ENTRIES', entries: ['book', 'apple']},
            {type: 'NEXT'},
            {type: 'VOTE', entry: 'book'},
            {type: 'VOTE', entry: 'book'},
            {type: 'VOTE', entry: 'apple'},
            {type: 'VOTE', entry: 'apple'},
            {type: 'VOTE', entry: 'apple'},
            {type: 'NEXT'}
        ];

        const finalState = actions.reduce(reducer, Map());

        expect(finalState).to.equal(fromJS({
            winner: 'apple'
        }));
    });
});

