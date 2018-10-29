const FsmDefinition = require('./src/definition');
const FsmDefinitionDumper = require('./src/definition-dumper');
const FsmPlace = require('./src/place');
const FsmTransition = require('./src/transition');
const FsmWorkflow = require('./src/workflow');

module.exports = {
    FsmDefinition: FsmDefinition,
    FsmDefinitionDumper: FsmDefinitionDumper,
    FsmPlace: FsmPlace,
    FsmTransition: FsmTransition,
    FsmWorkflow: FsmWorkflow,

    /**
     * @param name
     * @param onEnter
     * @param onLeave
     * @returns {FsmPlace}
     * @constructor
     */
    CreatePlace: (name, onEnter, onLeave) => new FsmPlace(name, onEnter, onLeave),

    /**
     * @param name
     * @param froms
     * @param tos
     * @param transition
     * @returns {FsmTransition}
     * @constructor
     */
    CreateTransition: (name, froms, tos, transition) => new FsmTransition(name, froms, tos, transition),

    /**
     * @param places
     * @param transitions
     * @param initialPlace
     * @returns {FsmDefinition}
     * @constructor
     */
    CreateDefinition: (places, transitions, initialPlace) => new FsmDefinition(places, transitions, initialPlace),

    /**
     * @param definition
     * @param context
     * @returns {FsmWorkflow}
     * @constructor
     */
    CreateWorkflow: (definition, context) => new FsmWorkflow(definition, context),

    /**
     * @param {FsmDefinition} definition
     * @return {string}
     * @constructor
     */
    DumpDot: (definition) => FsmDefinitionDumper.dumpDot(definition),
};