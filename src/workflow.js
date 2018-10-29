'use strict';

const storeProp = Symbol('StateProperty');
const FsmPlace = require('./place');

class FsmWorkflow {

    /**
     * @param {FsmDefinition} definition
     * @param {*} context
     */
    constructor(definition, context) {
        this._definition = definition;
        this._context = context;
    }

    get context() {
        return this._context;
    }

    /**
     * @param subject
     * @returns {Set}
     */
    getPlaces(subject) {
        if (typeof subject === 'object') {
            if (subject[storeProp] === undefined) {
                subject[storeProp] = new Set();
            }
            return subject[storeProp];
        } else {
            throw new Error('Subject should be Object. Given ' + typeof subject);
        }
    }

    clear(subject) {
        this.getPlaces(subject).clear();
    }

    init(subject) {
        let places = this.getPlaces(subject);
        if (places.size === 0) {
            let place = this._definition.initialPlace;
            places.add(place);
            if (this._definition.places.get(place) instanceof FsmPlace) {
                this._definition.places.get(place).onEnter(subject, this._context, this);
            }
        }
    }

    /**
     * @param subject
     * @param place
     * @returns {boolean}
     */
    hasPlace(subject, place) {
        return this.getPlaces(subject).has(place.toString());
    }

    can(subject, transitionName) {
        transitionName = transitionName.toString();
        let places = this.getPlaces(subject);
        let transitions = [];
        this._definition.transitions.forEach(transition => {
            if (transition.name === transitionName) {
                transitions.push(transition);
            }
        });
        if (transitions.length > 0) {
            for (let transition of transitions) {
                if (transition.froms.every(place => places.has(place.toString())) && transition.guard(subject)) {
                    return true;
                }
            }
            return false;
        } else {
            throw new Error('Transition ' + transitionName + ' not defined');
        }
    }

    apply(subject, transitionName, params) {
        transitionName = transitionName.toString();
        let transitions = [];
        this._definition.transitions.forEach(transition => {
            if (transition.name == transitionName) {
                transitions.push(transition);
            }
        });

        if (transitions.length > 0) {
            let places = this.getPlaces(subject);
            /** @type {FsmTransition} */
            for (let transition of transitions) {
                if (transition.froms.every(place => places.has(place.toString())) && transition.guard(subject)) {
                    transition.froms.forEach(place => {
                        places.delete(place.toString());
                        if (place instanceof FsmPlace) {
                            place.onLeave(subject, this._context, this);
                        }
                    });

                    transition.transition(subject, this._context, this, params);
                    transition.tos.forEach(place => {
                        places.add(place.toString());
                        if (place instanceof FsmPlace) {
                            place.onEnter(subject, this._context, this);
                        }
                    });
                    return true;
                }
            }
            throw new Error('Transition ' + transitionName + ' not allowed from places ' + Array.from(places).join(','));
        } else {
            throw new Error('Transition ' + transitionName + ' not defined');
        }
    }

}

module.exports = FsmWorkflow;