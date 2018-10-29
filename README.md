# javascript-workflow
Javascript finite state machine 

# Socket Synchronization

![Alt text](https://g.gravizo.com/g?digraph G {
  node [shape = ellipse style=filled]; INIT;
  node [shape = ellipse style=none]; 
  INIT -> WAIT_RPC,WAIT_SOCKET [label = "start"];
  WAIT_RPC -> WAIT_RPC [label = "loadRpc"];
  WAIT_RPC -> LOADED_RPC [label = "loadedRpc"];
  WAIT_SOCKET -> DEFINED_SOCKET [label = "defineSocket"];
  DEFINED_SOCKET,LOADED_RPC -> VALIDATION [label = "runValidate"];
  VALIDATION -> WORKING [label = "validated"];
  WORKING -> LOADED_RPC,WAIT_SOCKET [label = "corrupted"];
  VALIDATION -> INIT [label = "corrupted"];
  DEFINED_SOCKET -> INIT [label = "corrupted"];
  WORKING -> WORKING [label = "defineSocket"];
}
)
