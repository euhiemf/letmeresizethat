(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($) {
    var Box, default_calculations;
    Box = (function() {
      function Box(el, settings) {
        this.settings = settings;
        this.moseup = __bind(this.moseup, this);
        this.mousedown = __bind(this.mousedown, this);
        this.mouseleave = __bind(this.mouseleave, this);
        this.borderhover = __bind(this.borderhover, this);
        this.element = $(el);
        this.setmetrics();
        this.element.on('mousemove', this.borderhover);
        this.element.on('mousedown', this.mousedown);
        this.element.on('mouseleave', this.mouseleave);
        $(document).on('mouseup', this.moseup);
      }

      Box.prototype.setmetrics = function() {
        this.width = this.element.outerWidth();
        return this.height = this.element.outerHeight();
      };

      Box.prototype.borderhover = function(ev) {
        var colborder, cursortype, rowborder, side, sides, status;
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
            $('html').css('cursor', cursortype);
            for (side in sides) {
              status = sides[side];
              if (status === true) {
                this.current_side = side;
              }
            }
            return this.ishoverborder = true;
          }
        } else if (this.ishoverborder) {
          return this.mouseleave();
        }
      };

      Box.prototype.mouseleave = function() {
        if (!this.borderisfollowing) {
          $('html').css('cursor', 'default');
          return this.ishoverborder = false;
        }
      };

      Box.prototype.mousedown = function(ev) {
        if (this.ishoverborder) {
          console.log('mouse down');
          this.initial_mousepos = {
            x: ev.clientX,
            y: ev.clientY
          };
          return this.borderisfollowing = true;
        }
      };

      Box.prototype.moseup = function(ev) {
        console.log(this.borderisfollowing);
        if (!this.borderisfollowing) {
          return false;
        }
        this.current_mousepos = {
          x: ev.clientX,
          y: ev.clientY
        };
        this.resize();
        return this.borderisfollowing = false;
      };

      Box.prototype.resize = function() {
        if (!this.initial_mousepos) {
          console.log('no initial moseposition was found');
          return;
        }
        this.settings.sideCalculations[this.current_side](this.element, this.initial_mousepos, this.current_mousepos);
        return this.setmetrics();
      };

      return Box;

    })();
    default_calculations = {
      top: function(element, initial_mousepos, current_mousepos) {
        element.height(element.height() + initial_mousepos.y - current_mousepos.y);
        return element.css('margin-top', parseInt(element.css('margin-top')) - initial_mousepos.y + current_mousepos.y);
      },
      bottom: function(element, initial_mousepos, current_mousepos) {
        return element.height(element.height() + current_mousepos.y - initial_mousepos.y);
      },
      right: function(element, initial_mousepos, current_mousepos) {
        return element.width(element.width() + current_mousepos.x - initial_mousepos.x);
      },
      left: function(element, initial_mousepos, current_mousepos) {
        element.width(element.width() + initial_mousepos.x - current_mousepos.x);
        return element.css('margin-left', parseInt(element.css('margin-left')) - initial_mousepos.x + current_mousepos.x);
      }
    };
    $.fn.lmresize = function(options) {
      var defaults, settings;
      defaults = {
        borderWidth: 4,
        sideCalculations: default_calculations
      };
      settings = $.extend(true, {}, defaults, options);
      this.each(function() {
        var element;
        return element = new Box(this, settings);
      });
      return this;
    };
    return $.fn.letmeresizethat = $.fn.lmresize;
  })(jQuery);

}).call(this);
