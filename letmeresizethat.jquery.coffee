


(($)->

	class Box

		constructor: (el, @settings) ->

			@element = $(el)

			@connections = []

			@setmetrics()


			@element.on('mousemove', @borderhover)
			@element.on('mousedown', @mousedown)
			@element.on('mouseleave', @mouseleave)
			$(document).on('mouseup', @moseup)


		addConnection: (instance, side) ->

			console.log instance, side

			@connections.push
				side: side
				instance: instance

			return instance

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


					corners =
						'top:right': (sides.right && ev.offsetY <= @settings.cornerSize) || (sides.top && ev.offsetX >= @width - @settings.cornerSize)
						'bottom:right': (sides.right && ev.offsetY >= @height - @settings.cornerSize) || (sides.bottom && ev.offsetX >= @width - @settings.cornerSize)
						'top:left': (sides.left && ev.offsetY <= @settings.cornerSize) || (sides.top && ev.offsetX <= @settings.cornerSize)
						'bottom:left': (sides.left && ev.offsetY >= @height - @settings.cornerSize) || (sides.bottom && ev.offsetX <= @settings.cornerSize)

					iscorner = corner for corner, status of corners when status is true

					if !!iscorner
						@current_sides = iscorner.split ':'

						cursortype = if iscorner is 'top:right' or iscorner is 'bottom:left' then 'nesw-resize' else 'nwse-resize'
					else
						@current_sides = for side, status of sides when status is true
							side

						cursortype = if colborder then 'ew-resize' else 'ns-resize'

					$('html').css('cursor', cursortype).disableSelection()
					@ishoverborder = true


			else if @ishoverborder

				@mouseleave()


		mouseleave: =>

			if not @borderisfollowing

				$('html').css('cursor', 'default').enableSelection()
				@ishoverborder = false


		mousedown: (ev) =>

			if @ishoverborder

				@initial_mousepos =
					x: ev.clientX
					y: ev.clientY

				@borderisfollowing = true

		moseup: (ev) =>

			if not @borderisfollowing then return false


			@current_mousepos =
				x: ev.clientX
				y: ev.clientY

			@resize()

			@borderisfollowing = false

		resize: (trigger = true) ->

			if not @initial_mousepos
				console.log 'no initial moseposition was found'
				return



			for side in @current_sides
				@settings.sideCalculations[side](@element, @initial_mousepos, @current_mousepos)


			if trigger

				for connection in @connections when @current_sides.indexOf(instance.opposite(connection.side)) >= 0

					###

					when the opposite of connection.side is in current_sides

					###

					$.extend connection.instance,
						initial_mousepos: @initial_mousepos
						current_mousepos: @current_mousepos
						current_sides: [connection.side]


					connection.instance.resize(false)

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



	instance = 
		opposite: (side) ->
			switch side
				when 'left' then 'right'
				when 'right' then 'left'
				when 'bottom' then 'top'
				when 'top' then 'bottom'

			
		memory: []
		connect: ->

			console.log @memory

			for spot in @memory
				spot.connection.addConnection spot.of, spot.tothe	
				spot.of.addConnection spot.connection, @opposite(spot.tothe)

			@clear()

		clear: ->

			@memory = []
			





	$.fn.lmresize = (options) ->

		defaults =
			borderWidth: 4
			cornerSize: 10
			sideCalculations: default_calculations
			connect: false
			isConnected: false


		settings = $.extend(true, {}, defaults, options);


		element = new Box(@, settings)


		if settings.isConnected

			for spot, i in instance.memory when not spot.hasOwnProperty('of')
				spot['of'] = element


		

		getElement = of: (selector, options = {}) ->


			for side in @sides

				instance.memory.push

					connection: element
					tothe: side


			options.isConnected = true


			$(selector).lmresize options




		getSide = tothe: (sides...) ->
			getElement.sides = sides
			
			getElement




		if not settings.connect and settings.isConnected then instance.connect()





		if settings.connect then return getSide else return @








	$.fn.letmeresizethat = $.fn.lmresize

	$.fn.disableSelection = ->
		@.attr('unselectable', 'on').css('user-select', 'none').on('selectstart', false)
	$.fn.enableSelection = ->
		@.attr('unselectable', 'off').css('user-select', 'all').unbind('selectstart', false)


)(jQuery)
