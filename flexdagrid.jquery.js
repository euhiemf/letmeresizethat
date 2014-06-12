(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($) {
    var Box;
    Box = (function() {
      function Box(el, settings) {
        this.settings = settings;
        this.borderfollowmouse = __bind(this.borderfollowmouse, this);
        this.borderhover = __bind(this.borderhover, this);
        this.element = $(el);
        this.width = this.element.outerWidth();
        this.height = this.element.outerHeight();
        this.element.on('mousemove', this.borderhover);
        this.element.on('mousedown', this.borderfollowmouse);
      }

      Box.prototype.borderhover = function(ev) {
        var colborder, cursortype, rowborder, side, sides, status, _results;
        if (this.borderisfollowing) {
          return;
        }
        sides = {
          top: ev.offsetY <= this.settings.borderWidth,
          bottom: ev.offsetY >= this.height - this.settings.borderWidth,
          right: ev.offsetX >= this.width - this.settings.borderWidth,
          left: ev.offsetX <= this.settings.borderWidth
        };
        colborder = sides.right || sides.left;
        rowborder = sides.bottom || sides.top;
        if (colborder || rowborder) {
          if (!this.ishoverborder) {
            cursortype = colborder ? 'col-resize' : 'row-resize';
            this.element.css('cursor', cursortype);
            this.ishoverborder = true;
            _results = [];
            for (side in sides) {
              status = sides[side];
              if (status === true) {
                _results.push(this.current_side = side);
              }
            }
            return _results;
          }
        } else if (this.ishoverborder) {
          this.element.css('cursor', 'default');
          return this.ishoverborder = false;
        }
      };

      Box.prototype.borderfollowmouse = function(ev) {
        if (this.ishoverborder) {
          return this.borderisfollowing = true;
        }
      };

      return Box;

    })();
    return $.fn.flexdagrid = function(options) {
      var defaults, settings;
      defaults = {
        borderWidth: 4
      };
      settings = $.extend(true, {}, defaults, options);
      this.each(function() {
        var element;
        return element = new Box(this, settings);
      });
      return this;
    };
  })(jQuery);

}).call(this);
