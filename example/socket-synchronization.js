const fsm = require('../index');

const init = fsm.CreatePlace('INIT');
const waitingSocket = fsm.CreatePlace('WAIT_SOCKET');
const definedSocket = fsm.CreatePlace('DEFINED_SOCKET');
const waitingRpc = fsm.CreatePlace('WAIT_RPC');
const loadedRpc = fsm.CreatePlace('LOADED_RPC');
const validation = fsm.CreatePlace('VALIDATION');
const working = fsm.CreatePlace('WORKING');


const definition = fsm.CreateDefinition([init, working, waitingRpc, waitingSocket, definedSocket, loadedRpc, validation], [

    fsm.CreateTransition('start', [init], [waitingRpc, waitingSocket]),
    fsm.CreateTransition('loadRpc', [waitingRpc], [waitingRpc]),
    fsm.CreateTransition('loadedRpc', [waitingRpc], [loadedRpc]),
    fsm.CreateTransition('defineSocket', [waitingSocket], [definedSocket]),
    fsm.CreateTransition('runValidate', [definedSocket, loadedRpc], [validation]),
    fsm.CreateTransition('validated', [validation], [working]),
    fsm.CreateTransition('corrupted', [working], [loadedRpc, waitingSocket]),
    fsm.CreateTransition('corrupted', [validation], [init]),
    fsm.CreateTransition('corrupted', [definedSocket], [init]),
    fsm.CreateTransition('defineSocket', [working], [working]),
]);

console.log(fsm.DumpDot(definition));