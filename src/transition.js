'use strict';

class FsmTransition {

    constructor(name, froms, tos, transition) {
        this._name = name.toString();

        if (typeof froms === 'string') {
            this._froms = [froms];
        } else if (Array.isArray(froms)) {
            this._froms = froms;
        } else if (froms && typeof froms[Symbol.iterator] === 'function') {
            this._froms = Array.from(froms);
        } else {
            throw new Error('Invalid froms type (array) given: ' + typeof froms);
        }

        if (typeof tos === 'string') {
            this._tos = [tos];
        } else if (Array.isArray(tos)) {
            this._tos = tos;
        } else if (tos && typeof tos[Symbol.iterator] === 'function') {
            this._tos = Array.from(tos);
        } else {
            throw new Error('Invalid tos type (array) given: ' + typeof tos);
        }

        if (transition) {
            this._transition = transition;
        } else {
            this._transition = () => {};
        }

        this._guard = () => true;
    }

    set guard(val) {
        this._guard = val;
    }

    get guard() {
        return this._guard;
    }

    set transition(val) {
        this._transition = val;
    }

    get transition() {
        return this._transition;
    }

    get name() {
        return this._name;
    }

    get froms() {
        return this._froms;
    }

    get tos() {
        return this._tos;
    }

    toString() {
        return this._name;
    }
}

module.exports = FsmTransition;