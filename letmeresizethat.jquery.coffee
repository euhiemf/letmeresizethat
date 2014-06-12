


(($)->

	class Box

		constructor: (el, @settings) ->

			@element = $(el)

			@width = @element.outerWidth()
			@height = @element.outerHeight()


			@element.on('mousemove', @borderhover)
			@element.on('mousedown', @borderfollowmouse)


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

					@element.css('cursor', cursortype)

					@ishoverborder = true

					@current_side = side for side, status of sides when status is true


			else if @ishoverborder

				@element.css('cursor', 'default')
				@ishoverborder = false

		borderfollowmouse: (ev) =>

			if @ishoverborder
				@borderisfollowing = true

		setborderposition: (ev) =>




	$.fn.flexdagrid = (options) ->

		defaults =
			borderWidth: 4

		settings = $.extend(true, {}, defaults, options);


		@each ->
			# write the plugin here!

			element = new Box(@, settings)


		return @



)(jQuery)
