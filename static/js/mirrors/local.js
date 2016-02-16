(function () {
  'use strict';

  let n;
  const getRand = () =>
    (n = Math.random()) && n > Math.random() ? n : -n

  function LocalMirror (options) {
    if (!(this instanceof LocalMirror)) return new LocalMirror(options)

    this.context = document.querySelector(options.canvasSelector).getContext('2d')
    this.image   = document.querySelector(options.imageSelector)
    this.onDrawOpportunity = options.onDrawOpportunity
    this.previousSrc = ''
    this.originalOptions = options
  }

  Object.defineProperties(LocalMirror.prototype, {
    options : {
      get: function () {
        return Object.freeze(Object.assign({ }, { useCache : false }, this.originalOptions))
      }
    },

    shouldDraw : {
      get: function () {
        return !this.options.useCache || this.image.src !== this.previousSrc
      }
    },

    draw : {
      value : function () {
        if (this.shouldDraw) {
          this.context.clearRect(0, 0, 400, 400)
          this.context.setTransform(getRand(), getRand(), getRand(), getRand(), 400, 400)
          this.context.drawImage(this.image, 0, 0)
          this.previousSrc = this.image.src
        }
      }
    }
  })

  LocalMirror.create = options => {
    const m = LocalMirror(options)
    m.onDrawOpportunity(m.draw.bind(m))
    return m
  }

  window.LocalMirror = LocalMirror
})()
