(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($) {
    var Box, default_calculations, instance;
    Box = (function() {
      function Box(el, settings) {
        this.settings = settings;
        this.moseup = __bind(this.moseup, this);
        this.mousedown = __bind(this.mousedown, this);
        this.mouseleave = __bind(this.mouseleave, this);
        this.borderhover = __bind(this.borderhover, this);
        this.element = $(el);
        this.connections = [];
        this.setmetrics();
        this.element.on('mousemove', this.borderhover);
        this.element.on('mousedown', this.mousedown);
        this.element.on('mouseleave', this.mouseleave);
        $(document).on('mouseup', this.moseup);
      }

      Box.prototype.addConnection = function(instance, side) {
        console.log(instance, side);
        this.connections.push({
          side: side,
          instance: instance
        });
        return instance;
      };

      Box.prototype.setmetrics = function() {
        this.width = this.element.outerWidth();
        return this.height = this.element.outerHeight();
      };

      Box.prototype.borderhover = function(ev) {
        var colborder, corner, corners, cursortype, iscorner, rowborder, side, sides, status;
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
            corners = {
              'top:right': (sides.right && ev.offsetY <= this.settings.cornerSize) || (sides.top && ev.offsetX >= this.width - this.settings.cornerSize),
              'bottom:right': (sides.right && ev.offsetY >= this.height - this.settings.cornerSize) || (sides.bottom && ev.offsetX >= this.width - this.settings.cornerSize),
              'top:left': (sides.left && ev.offsetY <= this.settings.cornerSize) || (sides.top && ev.offsetX <= this.settings.cornerSize),
              'bottom:left': (sides.left && ev.offsetY >= this.height - this.settings.cornerSize) || (sides.bottom && ev.offsetX <= this.settings.cornerSize)
            };
            for (corner in corners) {
              status = corners[corner];
              if (status === true) {
                iscorner = corner;
              }
            }
            if (!!iscorner) {
              this.current_sides = iscorner.split(':');
              cursortype = iscorner === 'top:right' || iscorner === 'bottom:left' ? 'nesw-resize' : 'nwse-resize';
            } else {
              this.current_sides = (function() {
                var _results;
                _results = [];
                for (side in sides) {
                  status = sides[side];
                  if (status === true) {
                    _results.push(side);
                  }
                }
                return _results;
              })();
              cursortype = colborder ? 'ew-resize' : 'ns-resize';
            }
            $('html').css('cursor', cursortype).disableSelection();
            return this.ishoverborder = true;
          }
        } else if (this.ishoverborder) {
          return this.mouseleave();
        }
      };

      Box.prototype.mouseleave = function() {
        if (!this.borderisfollowing) {
          $('html').css('cursor', 'default').enableSelection();
          return this.ishoverborder = false;
        }
      };

      Box.prototype.mousedown = function(ev) {
        if (this.ishoverborder) {
          this.initial_mousepos = {
            x: ev.clientX,
            y: ev.clientY
          };
          return this.borderisfollowing = true;
        }
      };

      Box.prototype.moseup = function(ev) {
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
        var connection, side, _i, _j, _len, _len1, _ref, _ref1;
        if (!this.initial_mousepos) {
          console.log('no initial moseposition was found');
          return;
        }
        _ref = this.current_sides;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          side = _ref[_i];
          this.settings.sideCalculations[side](this.element, this.initial_mousepos, this.current_mousepos);
        }
        _ref1 = this.connections;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          connection = _ref1[_j];
          $.extend(connection.instance, {
            initial_mousepos: this.initial_mousepos,
            current_mousepos: this.current_mousepos,
            sides: [connection.side]
          });
          connection.instance.resize();
        }
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
    instance = {
      memory: [],
      connect: function() {
        return console.log(this.memory);
      }
    };
    $.fn.lmresize = function(options) {
      var defaults, element, getElement, getSide, settings;
      defaults = {
        borderWidth: 4,
        cornerSize: 10,
        sideCalculations: default_calculations,
        connect: false,
        isConnected: false
      };
      settings = $.extend(true, {}, defaults, options);
      element = new Box(this, settings);
      if (settings.isConnected) {
        instance.memory[instance.memory.length - 1]['of'] = element;
      }
      getElement = {
        of: function(selector, options) {
          if (options == null) {
            options = {};
          }
          instance.memory.push({
            connection: element,
            tothe: this.side
          });
          options.isConnected = true;
          return $(selector).lmresize(options);
        }
      };
      getSide = {
        tothe: function(side) {
          getElement.side = side;
          return getElement;
        }
      };
      if (!settings.connect && settings.isConnected) {
        instance.connect();
      }
      if (settings.connect) {
        return getSide;
      } else {
        return this;
      }
    };
    $.fn.letmeresizethat = $.fn.lmresize;
    $.fn.disableSelection = function() {
      return this.attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false);
    };
    return $.fn.enableSelection = function() {
      return this.attr('unselectable', 'off').css('user-select', 'all').unbind('selectstart', false);
    };
  })(jQuery);

}).call(this);
