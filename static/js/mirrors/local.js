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
        return Object.freeze(Object.assign({ }, { useCache : true }, this.originalOptions))
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
          this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
          var height = 600;
          var widthFactor = this.image.height/height;
          this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, this.image.width / widthFactor, height);
          this.previousSrc = this.image.src;


          const imageData = this.context.getImageData(0, 0, this.image.width / widthFactor, height );
          const hslValues = hslToColor(hslValuesFromContext(imageData));
          circlePack('svg#circlePack', hslValues)

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
