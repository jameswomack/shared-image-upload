window.RemoteMirror = { }
window.RemoteMirror.createWithLocalMirror = localMirror => {
  const socket = window.io.connect()
  new window.SocketIOFileUpload(socket).listenOnInput(document.getElementById('siofu_input'))
  socket.addEventListener('show', e => {
    e.file &&
      (localMirror.image.src = encodeURIComponent('/' + e.file.name))
  })
}
