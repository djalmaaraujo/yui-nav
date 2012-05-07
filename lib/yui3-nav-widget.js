/*
 * TODO: 
 * - Fazer menu acessivel
 * - Colocar o menu para carregar de um JSON
 *
 */
modules = [
	'node', 
	'widget', 
	'get', 
	'selector-css3',
	'event-key'
	];
	
YUI().use(modules, function (Y) {
	
	// Caching Modules
	var Lang 	= Y.Lang,
		Widget	= Y.Widget,
		Node	= Y.Node,
		Get		= Y.Get;
	
		
	// Widget Constructor
	function NavWidget (config) {
		NavWidget.superclass.constructor.apply(this, arguments);
	}
	
	
	// Default name and Attributs
	NavWidget.NAME = 'nav-widget';
	NavWidget.ATTRS = {
		dataSource: null
	}
	
	
	// Extended Classes Methods
	Y.extend(NavWidget, Y.Widget, {
		
		/**
		 * Initializer Method
		 *
		 */
		initializer: function () {
			this.className		= Y.ClassNameManager.getClassName(NavWidget.NAME);
			this.boundingBox	= this.get('boundingBox');
			this.contentBox 	= this.get('contentBox');
			this.dataSource 	= this.get('dataSource');
			this.globalNode		= Node.one(this.get('srcNode'));
			this.tabTrigger 	= false;
			this._setDataSourceType();
		},
		
		
		/**
		 * Render UI Widget
		 *
		 */
		renderUI: function () {
			this._loadWidgetCss();			
		},
		
		
		/**
		 * bind Events and behaviors
		 *
		 */
		bindUI: function () {
			this.boundingBox.on('mouseover', this._removeHandleKeys, this);
			Node.one('body').on('click', this._hideAll, this);
			Node.one('body').on('key', this._handleKeys, 'tab', this);
		},
		
		
		/**
		 * Hide all sub navs
		 *
		 */
		_hideAll: function () {
			Node.all('ul li').hide();
		},
		
		
		/**
		 * Remove tab trigger
		 *
		 */
		_removeHandleKeys: function () {
			this.tabTrigger = false;
		},
		
		
		/**
		 * Bind tab trigger
		 *
		 */
		_handleKeys: function (a) {
			this.tabTrigger = true;
			this._handleFocusNav(this.contentBox);
		},
		
		
		/**
		 * Return last item from UL
		 *
		 */
		_getLastItem: function (container) {
			var list = container.all('li'),
			    len  = list.size(),
			    last;

			if (len) {
			  return last = list.item(len - 1);
			} else {
				return false;
			}
		},
		
		
		/**
		 * Make nav Accessible
		 *
		 */
		_handleFocusNav: function (container) {
			if (this.tabTrigger === true) {
				var lis 	= container.all('li'),
					aux 	= 0,
					self 	= this;

				lis.each(function (LI) {
					var link 	= LI.one('a'),
						ul 		= LI.one('ul');

					if (ul) {
						link.on('focus', function () {
							ul.setStyle('display', 'block');
							self._handleFocusNav(ul);
						});

						var lastItem = self._getLastItem(ul);
						if (lastItem) {
							lastItem.on('blur', function () {
								ul.setStyle('display', 'none');
							});
						}
					}
					aux++;
				});
			}
		},
		
		
		/**
		 * Set up navContainer or create a new Node
		 *
		 */
		_setDataSourceType: function () {
			if (Lang.isString(this.dataSource)) {
				this.navContainer = Node.one(this.dataSource);
				
			} else if (Lang.isObject(this.dataSource, true)) {
				var navNode = this._attachNavOptions();
				this.navContainer = Node.one(navNode);
				
			} else {
				throw new Error('Wrong dataSource Type.');
			}
		},
		
		
		/**
		 * Create NODE nav with JSON
		 *
		 */
		_attachNavOptions: function () {
			// TODO: Create a recursive method to create Nav html element
			// console.log(this.dataSource);
		},
		
		
		/**
		 * 
		 *
		 */
		_loadWidgetCss: function () {
			Get.css('lib/' + this.className + '.css');
		}
	});
	
	
	/**
	 * Examples
	 *
	 */
	
	/* Example 1 - #tag Markup HTML */
	var navigation = new NavWidget({
		srcNode: '#nav',
		dataSource: '#nav'  // cound be a #id or a .class or an Object width nested params
	});
	navigation.render();
});