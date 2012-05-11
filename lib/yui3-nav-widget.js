/*
 * A YUI Experiment with
 *
 * - Accessible NAV;
 * - Orientation [Vertical, Horizontal];
 * - Build nav with HTML Markup or JSON object;
 * - Add simple events;
 * - Load multiple CSS;
 * - Re-usable widget with other YUI instances.
 *
 */

var MODULES = [
  'base',
  'node',
  'widget',
  'get',
  'selector-css3',
  'event-key'
  ];


YUI.add('nav-widget', function (Y) {

  // Caching Modules
  var Lang    = Y.Lang,
      Widget  = Y.Widget,
      Node    = Y.Node,
      Get     = Y.Get;


  // Extended Classes Methods
  Y.NavWidget = Y.Base.create('nav-widget', Y.Widget, [], {

    /**
     * Initializer Method
     *
     */
    initializer: function () {
      this.className    = Y.ClassNameManager.getClassName(Y.NavWidget.NAME);
      this.dataSource   = this.get('dataSource');
      this.globalNode   = Node.one(this.get('srcNode'));
      this.boundingBox  = this.get('boundingBox');
      this.contentBox   = this.get('contentBox');
      this.tabTrigger   = false;

      this._setDataSourceType();
    },


    /**
     * Render UI Widget
     *
     */
    renderUI: function () {
      this._loadWidgetCss();
      this._addMajorLiClasses();
      this._renderOrientation();
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
     * Set the nav orientation (horizontal, vertical)
     *
     */
    _renderOrientation: function () {
      var orientation = this.get('orientation');
          addClass    = this.className + '-' + ((orientation != 'vertical') ? 'horizontal' : orientation);

      this.get('contentBox').addClass(addClass);
    },


    /**
     * Add custo class to major Li's
     *
     */
    _addMajorLiClasses: function () {
      var majorLis  = this.contentBox.all('>li'),
            self    = this;

      majorLis.each(function (node) {
        node.addClass(self.className + '-major-li');
      });
    },


    /**
     * Hide all sub navs
     *
     */
    _hideAll: function () {
      Node.all('.' + this.className + '-active').removeClass(this.className + '-active');
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
          last = '';

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
        var lis   = container.all('li'),
            aux   = 0,
            self  = this;

        lis.each(function (LI) {
          var link  = LI.one('a'),
              ul    = LI.one('ul');

          if (ul) {
            link.on('focus', function () {
              ul.addClass(self.className + '-active');
              self._handleFocusNav(ul);
            });

            var lastItem = self._getLastItem(ul);
            if (lastItem) {
              lastItem.on('blur', function () {
                ul.removeClass(self.className + '-active');
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
      var dataSource = this.dataSource;

      if (Lang.isObject(dataSource, true)) {
        var html = this._recursiveAttachJson(dataSource);
        this.get('contentBox').append(html);

      } else {
        throw new Error('Wrong dataSource Structure. Create a JSON object.');
      }
    },


    /**
     * Recursive JSON parser (need refact)
     *
     */
    _recursiveAttachJson: function (container) {
      var self  = this,
          ul    = Node.create('<ul/>');

      Y.Array.each(container, function (obj) {
        var click = obj.click,
            li    = Node.create('<li/>');

        li.append(obj.content);
        if (Lang.isObject(obj.click)) li.on('click', obj.click);

        if (Lang.isObject(obj.childrens, true)) {
          var sub = self._recursiveAttachJson(obj.childrens, obj);
          li.append(sub);
          li.addClass(self.className + '-indicator');
        }

        ul.append(li);
      });


      return ul;
    },


    /**
     * Get CSS file
     *
     */
    _loadWidgetCss: function () {
      var cssPath = this.get("cssPath");

      if (cssPath) {
        if (Lang.isArray(cssPath)) {
          Y.Array.each(cssPath, function (obj) {
            Get.css(obj);
          });
        } else {
          Get.css(cssPath);
        }
      }
    }


  }, {

    // STATIC METHODS
    ATTRS: {
      dataSource: null,
      orientation: 'horizontal',
      cssPath: null
    }

  });
}, '1.0', {requires: MODULES});