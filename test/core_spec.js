import {List, Map} from 'immutable';
import {expect} from 'chai';
import {setEntries, next, vote} from '../src/core.js'

describe('application logic', () => {
    describe('setEntries', () => {
        it('adds the entries to the state', () => {
            const state = Map();
            const entries = List.of('book', 'apple');
            const nextState = setEntries(state, entries);

            expect(nextState).to.equal(Map({
                entries: List.of('book', 'apple')
            }));
        });

        it('converts to immutable', () => {
            const state = Map();
            const entries = ['book', 'apple'];
            const nextState = setEntries(state, entries);

            expect(nextState).to.equal(Map({
                entries: List.of('book', 'apple')
            }));
        })
    });

    // next will always pull 2 entries and put them into the vote
    describe('next', () => {
        it('takes the next two entries under the vote', () => {
            const state = Map({
                entries: List.of('book', 'apple', 'car', 'superman')
            });
            const nextState = next(state);

            expect(nextState).to.equal(Map({
                entries: List.of('car', 'superman'),
                vote: Map({
                    pair: List.of('book', 'apple')
                })
            }));
        });

        it('puts winner of current vote back to entries', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('book', 'apple'),
                    tally: Map({
                        'book': 2,
                        'apple': 4
                    })
                }),
                entries: List.of('car', 'superman', 'hero')
            });
            const nextState = next(state);

            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('car', 'superman')
                }),
                entries: List.of('hero', 'apple')
            }));
        });

        it('puts both from tied vote back to entries', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('apple', 'book'),
                    tally: Map({
                        'book': 3,
                        'apple': 3
                    })
                }),
                entries: List.of('car', 'superman', 'hero')
            });
            const nextState = next(state);

            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('car', 'superman')
                }),
                entries: List.of('hero', 'apple', 'book')
            }));
        });

        it('makes winner when just one entry left', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('book', 'apple'),
                    tally: Map({
                        'book': 5,
                        'apple': 3                        
                    })
                }),
                entries: List()
            });
            const nextState = next(state);

            expect(nextState).to.equal(Map({
                winner: 'book'
            }));
        })
    });

    describe('vote', () => {
        it('creates a tally for the voted entry', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('book', 'apple')
                }),
                entries: List()
            })

            const nextState = vote(state, 'book');

            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('book', 'apple'),
                    tally: Map({
                        'book': 1
                    })
                }),
                entries: List()
            }));
        });

        it('adds to existing tally for the voted entry', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('book', 'apple'),
                    tally: Map({
                        'book': 1,
                        'apple': 2
                    })
                }),
                entries: List()
            });

            const nextState = vote(state, 'apple');

            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('book', 'apple'),
                    tally: Map({
                        'book': 1,
                        'apple': 3
                    })
                }),
                entries: List()
            }));
        });
    });
});