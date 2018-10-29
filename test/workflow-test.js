'use strict';

const assert = require('assert');

const FsmDefinition = require('../src/definition');
const FsmPlace = require('../src/place');
const FsmTransition = require('../src/transition');
const FsmWorkflow = require('../src/workflow');


describe('FsmWorkflow', () => {

    it('big fsm test', function () {

        const init = new FsmPlace('INIT', (store, ctx, fsm) => {
            store.reset();
            fsm.apply(store, 'start');
        });
        const waitingSocket = new FsmPlace('WAIT_SOCKET');
        const definedSocket = new FsmPlace('DEFINED_SOCKET', (store, ctx, fsm) => {
            if (fsm.can(store, 'runValidate')) {
                fsm.apply(store, 'runValidate');
            }
        });
        const waitingRpc = new FsmPlace('WAIT_RPC', (store, ctx, fsm) => {
            fsm.apply(store, 'loadedRpc');
        });
        const loadedRpc = new FsmPlace('LOADED_RPC', (store, ctx, fsm) => {
            if (fsm.can(store, 'runValidate')) {
                fsm.apply(store, 'runValidate');
            }
        });
        const validation = new FsmPlace('VALIDATION', (store, ctx, fsm) => {
            fsm.apply(store, 'validated');
        });
        const working = new FsmPlace('WORKING', (store, ctx) => { });


        /**
         * @param store
         * @param ctx
         * @param {FsmWorkflow} fsm
         */
        const resetPlaces = (store, ctx, fsm) => {
            const places = fsm.getPlaces(store);
            ctx.logger.warn('Reset state for trades store ' + store.symbol.code, 'from places', places);
            places.clear();
        };

        const definition = new FsmDefinition([init, working, waitingRpc, waitingSocket, definedSocket, loadedRpc, validation], [

            new FsmTransition('start', [init], [waitingRpc, waitingSocket]),
            new FsmTransition('loadRpc', [waitingRpc], [waitingRpc]),
            new FsmTransition('loadedRpc', [waitingRpc], [loadedRpc]),
            new FsmTransition('defineSocket', [waitingSocket], [definedSocket], (store, ctx, fsm, val) => {
                store.SocketId = val;
            }),
            new FsmTransition('runValidate', [definedSocket, loadedRpc], [validation]),
            new FsmTransition('validated', [validation], [working], (store, ctx) => {
                ctx.emitSnapshot(store);
            }),
            new FsmTransition('corrupted', [working], [loadedRpc, waitingSocket], (store) => {

            }),
            new FsmTransition('corrupted', [validation], [init], resetPlaces),
            new FsmTransition('corrupted', [definedSocket], [init], resetPlaces),
            new FsmTransition('defineSocket', [working], [working], (store, ctx, fsm, val) => {
                store.SocketLast = val;
            }),
        ]);

        const testStore  = {
            reset: () => {}
        };

        let fsm = new FsmWorkflow(definition, {
            logger: {info: () => {}}, emitSnapshot: (store) => {store.snap = true}
        });

        fsm.init(testStore);
        assert(fsm.hasPlace(testStore, 'WAIT_SOCKET'));
        assert(fsm.hasPlace(testStore, 'LOADED_RPC'));

        fsm.apply(testStore, 'defineSocket', 123);
        assert.equal(testStore.SocketId, 123);
        assert.equal(testStore.snap, true);
        assert(fsm.hasPlace(testStore, 'WORKING'));

        let timeCan = process.hrtime();
        for (let i = 0; i < 100000; i++) {
            fsm.can(testStore, 'corrupted');
        }
        let diffCan = process.hrtime(timeCan);
        assert.ok(diffCan[0] * 1e3 + diffCan[1] * 1e-6 <= 200, 'Performance can');

        let timeApply = process.hrtime();
        for (let i = 0; i <= 100000; i++) {
            fsm.apply(testStore, 'defineSocket', i);
        }
        let diffApply = process.hrtime(timeApply);
        assert.ok(diffApply[0] * 1e3 + diffApply[1] * 1e-6 <= 500, 'Performance apply');
        assert.equal(testStore.SocketLast, 100000);

        assert.throws(() => fsm.apply(testStore, 'loadRpc'), /Transition loadRpc not allowed from places WORKING/);

    })
});
