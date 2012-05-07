/*
 * TODO: 
 * OK - Fazer menu acessivel
 * OK - Colocar o menu para carregar de um JSON
 * - Colocar configuração de vertical,horizontal
 * - Colocar delegate para click: () { } passado no JSON
 *
 */
modules = [
	'base',
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
	
		
	// Extended Classes Methods
	var NavWidget = Y.Base.create("nav-widget", Y.Widget, [], {
		
		/**
		 * Initializer Method
		 *
		 */
		initializer: function () {
			this.className		= Y.ClassNameManager.getClassName(NavWidget.NAME);
			this.dataSource 	= this.get('dataSource');
			this.globalNode		= Node.one(this.get('srcNode'));
			this.boundingBox	= this.get('boundingBox');
			this.contentBox 	= this.get('contentBox');
			this.tabTrigger 	= false;
			
			this._setDataSourceType();
		},
		
		
		/**
		 * Render UI Widget
		 *
		 */
		renderUI: function () {
			this._loadWidgetCss();			
			this._addMajorLiClasses();
		},
		
		
		/**
		 * bind Events and behaviors
		 *
		 */
		bindUI: function () {
			this.boundingBox.on('mouseover', this._removeHandleKeys, this);
			Node.one('window').on('click', this._hideAll, this);
			Node.one('body').on('key', this._handleKeys, 'tab', this);
		},
		
		
		/**
		 * Add custo class to major Li's
		 *
		 */
		_addMajorLiClasses: function () {
			var majorLis 	= this.contentBox.all('>li'),
				self 		= this;
			
			majorLis.each(function (node) {
				node.addClass(self.className + '-major-li');
			});
		},
		
		
		/**
		 * Hide all sub navs
		 *
		 */
		_hideAll: function () {
			this.contentBox.all('ul').each(function (UL) {
				UL.removeClass('yui3-nav-widget-active');
			});
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
							ul.addClass('yui3-nav-widget-active');
							self._handleFocusNav(ul);
						});

						var lastItem = self._getLastItem(ul);
						if (lastItem) {
							lastItem.on('blur', function () {
								ul.removeClass('yui3-nav-widget-active');
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
		_setDataSourceType: function (fn) {
			if (Lang.isString(this.dataSource)) {
				// using #tag or .tag
			} else if (Lang.isObject(this.dataSource, true)) {
				this._attachNavOptions();
			} else {
				throw new Error('Wrong dataSource Type.');
			}
		},
	
		
		/**
		 * Create NODE nav with JSON
		 *
		 */
		_attachNavOptions: function () {
			var dataSource 	= this.dataSource;
			
			if (Lang.isObject(dataSource, true)) {
				var html = this._recursiveAttachJson(dataSource, this);
				this.get('contentBox').append(html);
				
			} else {
				throw new Error('Wrong dataSource Structure. Create a JSON object.');
			}
		},
		
		
		/**
		 * Recursive JSON parser (need refact)
		 *
		 */
		_recursiveAttachJson: function (container, instance) {

			var ul		= '<ul>';
			Y.Array.each(container, function (index, value) {
				
				var click		= index.click,
					content		= index.content,
					childrens	= index.childrens,
					
				li = '<li>';
				li += content;
		
				if (Y.Lang.isObject(childrens, true)) {
					li += instance._recursiveAttachJson(childrens, instance);
				}
				
				li += '</li>';
				ul += li;
				
			});
			
			ul += '</ul>';
			
			return ul;
		},
		
 		
		/**
		 * Get CSS file
		 *
		 */
		_loadWidgetCss: function () {
			Get.css('lib/' + this.className + '.css');
		}
	}, {
		
		// STATIC METHODS
		ATTRS: {
			dataSource: null
		}
		
	});


	// Usage
	var navigation = new NavWidget({
		srcNode: '#nav',
		dataSource: '#nav'
	});
	navigation.render();
	
	
	var navigation = new NavWidget({
		srcNode: '#load-menu-here',
		dataSource: [
				{
					content: '<a href="http://yahoo.com">YaROOT</a>',
					childrens: [
						{ content: '<a href="http://yahoo.com">Menu 1.1</a>' },
						{ content: '<a href="http://yahoo.com">Google</a>' },
							{
								content: '<a href="http://yahoo.com">Yahoo</a>',
								childrens: [
									{ content: '<a href="#">Liferay.com</a>' },
									{ content: '<a href="#">2Liferay.com</a>' },
									{ content: '<a href="#">3Liferay.com</a>' },
									{ content: '<a href="#">4Liferay.com</a>' },
									{ content: '<a href="#">5Liferay.com</a>' }
								]
							}
					]
				}
		]
	});
	navigation.render();
	
});