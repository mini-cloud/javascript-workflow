'use strict';

class FsmPlace {

    constructor(name, onEnter, onLeave) {
        this._name = name.toString();

        if (onEnter) {
            this._onEnter = onEnter
        } else {
            this._onEnter = () => {};
        }
        if (onLeave) {
            this._onLeave = onLeave;
        } else {
            this._onLeave = () => {};
        }
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get onLeave() {
        return this._onLeave;
    }

    set onLeave(value) {
        this._onLeave = value;
    }

    get onEnter() {
        return this._onEnter;
    }

    set onEnter(value) {
        this._onEnter = value;
    }

    toString() {
        return this._name;
    }

}

module.exports = FsmPlace;