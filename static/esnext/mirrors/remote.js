window.RemoteMirror = { }
window.RemoteMirror.createWithLocalMirror = localMirror => {
  const socket = window.io.connect({
    'reconnect': true,
    'reconnection delay': 500,
    'max reconnection attempts': 10
  })
  socket.on('error', function() {
    socket.socket.reconnect()
  })
  new window.SocketIOFileUpload(socket).listenOnInput(document.getElementById('siofu_input'))
  socket.addEventListener('show', e => {
    e.file &&
      (localMirror.image.src = encodeURIComponent('/' + e.file.name))
  })
}
