import socketio from 'socket.io-client'

const socket = socketio('http://localhost:3333', {
    autoConnect: false,
})

function connect() {
    socket.connect()
}

function disconnect() {
    if (socket.connected) {
        socket.disconnect()
    }
}

function addNewTask(addFunction) {
    socket.on('new', addFunction)

}

function removeTask(removeFunction) {
    socket.on('taskDeleted', removeFunction)

}

function updateStage(updateFunction) {
    socket.on('taskStageUpdated', updateFunction)
}

export {
    connect,
    disconnect,
    addNewTask,
    removeTask,
    updateStage,
}