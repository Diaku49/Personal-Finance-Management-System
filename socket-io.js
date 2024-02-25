let io

const initializeServerAndSocketIO = async(server) => {
    try {
        await SIO.init(server);
        const io = SIO.getIo();
        io.on('connect', (socketIo) => {
            console.log('Client connected to socket.io.');
        });
        console.log('Socket.io initialized successfully.');
    } catch (error) {
        console.error('Failed to initialize socket.io:', error);
    }
}

const SIO = {
    init:(http)=>{
        io = require('socket.io')(http);
        return io;
    },
    getIo:()=>{
        if(!io){
            throw new Error('socketio not init.');
        }
        return io;
    }
}
module.exports = {initializeServerAndSocketIO,SIO};