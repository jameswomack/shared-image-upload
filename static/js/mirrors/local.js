'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

(function () {
  'use strict';

  var n = undefined;
  var getRand = function getRand() {
    return (n = Math.random()) && n > Math.random() ? n : -n;
  };

  function LocalMirror(options) {
    if (!(this instanceof LocalMirror)) return new LocalMirror(options);

    this.context = document.querySelector(options.canvasSelector).getContext('2d');
    this.image = document.querySelector(options.imageSelector);
    this.onDrawOpportunity = options.onDrawOpportunity;
    this.previousSrc = '';
    this.originalOptions = options;
  }

  Object.defineProperties(LocalMirror.prototype, {
    options: {
      get: function get() {
        return Object.freeze(_extends({}, { useCache: true }, this.originalOptions));
      }
    },

    shouldDraw: {
      get: function get() {
        return !this.options.useCache || this.image.src !== this.previousSrc;
      }
    },

    draw: {
      value: function value() {
        if (this.shouldDraw) {
          this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
          var height = 600;

          var widthFactor = this.image.height / height;
          this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, this.image.width / widthFactor, height);
          this.previousSrc = this.image.src;

          if (this.image.src === window.location.href || !this.image.width) return;

          var imageData = this.context.getImageData(0, 0, this.image.width / widthFactor, height);
          var hslValues = hslToColor(hslValuesFromContext(imageData));
          circlePack('svg#circlePack', hslValues);
        }
      }
    }
  });

  LocalMirror.create = function (options) {
    var m = LocalMirror(options);
    m.image.onload = m.draw.bind(m);
    return m;
  };

  window.LocalMirror = LocalMirror;
})();