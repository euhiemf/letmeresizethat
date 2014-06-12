


(($)->

	class Box

		constructor: (el, @settings) ->

			@element = $(el)


			@setmetrics()


			@element.on('mousemove', @borderhover)
			@element.on('mousedown', @mousedown)
			@element.on('mouseleave', @mouseleave)
			$(document).on('mouseup', @moseup)


		setmetrics: ->
			
			@width = @element.outerWidth()
			@height = @element.outerHeight()


		borderhover: (ev) =>

			if @borderisfollowing then return


			sides = 
				top: ev.offsetY <= @settings.borderWidth
				bottom: ev.offsetY >= @height - @settings.borderWidth
				right: ev.offsetX >= @width - @settings.borderWidth
				left: ev.offsetX <= @settings.borderWidth


			colborder = sides.right or sides.left
			rowborder = sides.bottom or sides.top

			if colborder or rowborder

				if not @ishoverborder

					cursortype = if colborder then 'col-resize' else 'row-resize'

					$('html').css('cursor', cursortype)


					@current_side = side for side, status of sides when status is true



					@ishoverborder = true


			else if @ishoverborder

				@mouseleave()


		mouseleave: =>

			if not @borderisfollowing

				$('html').css('cursor', 'default')
				@ishoverborder = false


		mousedown: (ev) =>

			if @ishoverborder
				# add pseudo element using the jss libary
				console.log 'mouse down'

				@initial_mousepos =
					x: ev.clientX
					y: ev.clientY

				@borderisfollowing = true

		moseup: (ev) =>

			console.log(@borderisfollowing)
			if not @borderisfollowing then return false


			@current_mousepos =
				x: ev.clientX
				y: ev.clientY

			@resize()

			@borderisfollowing = false

		resize: ->

			if not @initial_mousepos
				console.log 'no initial moseposition was found'
				return

			@settings.sideCalculations[@current_side](@element, @initial_mousepos, @current_mousepos)

			@setmetrics()



	default_calculations =
		top: (element, initial_mousepos, current_mousepos) ->
			element.height element.height() + initial_mousepos.y - current_mousepos.y 
			element.css 'margin-top', parseInt(element.css('margin-top')) - initial_mousepos.y + current_mousepos.y
		bottom: (element, initial_mousepos, current_mousepos) ->
			element.height element.height() + current_mousepos.y - initial_mousepos.y
		right: (element, initial_mousepos, current_mousepos) ->
			element.width element.width() + current_mousepos.x - initial_mousepos.x
		left: (element, initial_mousepos, current_mousepos) ->
			element.width element.width() + initial_mousepos.x - current_mousepos.x 
			element.css 'margin-left', parseInt(element.css('margin-left')) - initial_mousepos.x + current_mousepos.x



	$.fn.lmresize = (options) ->

		defaults =
			borderWidth: 4
			sideCalculations: default_calculations

		settings = $.extend(true, {}, defaults, options);


		@each ->
			# write the plugin here!

			element = new Box(@, settings)


		return @

	$.fn.letmeresizethat = $.fn.lmresize


)(jQuery)
