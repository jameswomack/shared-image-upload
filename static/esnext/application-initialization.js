document.addEventListener('DOMContentLoaded', () => {
  const local = window.LocalMirror.create({
    imageSelector     : '#source img',
    canvasSelector    : '#destination canvas',
    onDrawOpportunity : fn => setInterval(fn, 1000 / 23)
  })
  window.RemoteMirror.createWithLocalMirror(local)
})
