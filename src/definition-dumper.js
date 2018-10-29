'use strict';

class FsmDefinitionDumper {

    /**
     * @param {FsmDefinition} definition
     */
    static dumpDot(definition) {
        let dot = "digraph finite_state_machine {\n";
        dot += '  node [shape = ellipse style=filled]; ' + definition.initialPlace + ";\n";
        dot += "  node [shape = ellipse style=none]; \n";

        definition.transitions.forEach(transition => {
            dot += '  ' + transition.froms.join(',') + ' -> ' + transition.tos.join(',') + ' [label = "' + transition.name + '"]' + ";\n";
        });

        dot += "}";
        return dot;
    }
}

module.exports = FsmDefinitionDumper;