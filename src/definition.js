'use strict';

class FsmDefinition {

    constructor(places, transitions, initialPlace) {
        this._places = new Map;
        this._transitions = new Set;
        this._initialPlace = null;
        places.forEach(this.addPlace.bind(this));
        transitions.forEach(this.addTransition.bind(this));
        if (initialPlace) {
            this.initialPlace = initialPlace;
        }
    }

    /**
     * @returns {Map}
     */
    get places() {
        return this._places;
    }

    /**
     * @returns {Set}
     */
    get transitions() {
        return this._transitions;
    }

    get initialPlace() {
        return this._initialPlace;
    }

    set initialPlace(value) {
        if (this._places.has(value.toString())) {
            this._initialPlace = value.toString();
        } else {
            throw new Error('Initial place ' + value.toString() + ' not defined in places');
        }
    }

    addPlace(place) {
        if (this._places.size == 0) {
            this._initialPlace = place.toString();
        }
        if (this._places.has(place.toString())) {
            throw new Error('Duplicate place declaration ' + place);
        } else {
            this._places.set(place.toString(), place);
        }
    }

    /**
     *
     * @param {Transition} transition
     */
    addTransition(transition) {
        for (let place of transition.froms) {
            if (!this._places.has(place.toString())) {
                throw new Error('Place ' + place.toString() + ' not found in froms transition ' + transition.name);
            }
        }
        for (let place of transition.tos) {
            if (!this._places.has(place.toString())) {
                throw new Error('Place ' + place.toString() + ' not found in tos transition ' + transition.name);
            }
        }

        this._transitions.add(transition);
    }

}

module.exports = FsmDefinition;