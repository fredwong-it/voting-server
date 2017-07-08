import Server from 'socket.io';

export default function startServer(store) {
    const io = new Server().attach(8090);

    // listen store and send a state snapshot whenever state changes
    store.subscribe(
        () => io.emit('state', store.getState().toJS())
    );

    // listen to 'connection' events on our Socket.io server
    // for clients to immediately receive the current state when they connect to the application
    io.on('connection', (socket) => {
        socket.emit('state', store.getState().toJS());
    });

    // list 'action' event which is emitted from the client
    socket.on('action', store.dispatch.bind(store));
}