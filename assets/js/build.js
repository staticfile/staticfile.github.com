'use strict';

Vue.config.devtools = true;
(function () {
  var _i18n = {
    default: 'zh',

    'add-one': {
      'zh': '新增一个库',
      'en': 'Add one'
    },
    'feedback': {
      'zh': '意见反馈',
      'en': 'feedback'
    },
    'about': {
      'zh': '简介',
      'en': 'About'
    },
    'switch-language': {
      'zh': 'English',
      'en': '中文'
    },
    'purpose': {
      'zh': '我们的目标是提供这样一个仓库，让它尽可能全面收录优秀的开源库，并免费为之提供 CDN 加速服务，使之有更好的访问速度和稳定的环境。同时，我们也提供开源库源接入的入口，让所有人都可以提交开源库，包括 JavaScript、CSS、图片和 swf 等静态文件。',
      'en': 'Our purpose is to provide a warehouse that stores great open-source libs as mush as possible and serve them via a stable & fast CDN service (in China). In addition, we also provide you an entrance for submitting libs, including JS / CSS / Images & SWF files.'
    },
    'install-tip': {
      'zh': '// 安装工具，<a href="https://github.com/staticfile/cli#readme" target="_blank">使用说明</a>',
      'en': '// CLI Tool, <a href="https://github.com/staticfile/cli#readme" target="_blank">instruction</a>.'
    },
    'query-placeholder': {
      'zh': '请输入开源库的名称 ..',
      'en': 'Please input a name ..'
    },
    'homepage': {
      'zh': '网站',
      'en': 'Home Page'
    },
    'source': {
      'zh': '源代码',
      'en': 'Source'
    },
    'other-versions': {
      'zh': '其他版本',
      'en': 'Other versions'
    },
    'powered': {
      'zh': 'CDN 加速由七牛云存储提供',
      'en': 'CDN service provided by Qiniu Tech'
    }
  };

  var language = _i18n.default;

  var vm = new Vue({
    el: '#wrapper',

    data: {
      query: '',

      libs: [],
      popular: [],
      loading: true,
      language: 'zh',

      apiRoot: 'http://api.staticfile.qiniu.io/v1/',
      httpDomain: 'http://cdn.staticfile.org',
      httpsDomain: 'https://staticfile.qnssl.com'
    },

    mounted: function mounted() {
      var query = {};
      location.search.substr(1).split('&').map(function (s) {
        return s.split('=');
      }).forEach(function (pair) {
        return query[pair[0]] = pair[1];
      });

      if (query.ln) {
        language = query.ln;
        this.language = query.ln;
      }

      Stickyfill.add(this.$refs.searchBar);
      this.loadPopular();
    },


    watch: {
      query: function () {
        var timer = null;

        return function (val) {
          if (val) return;

          if (timer) clearTimeout(timer);

          timer = setTimeout(function () {
            vm.loadPopular();
          }, 200);
        };
      }()
    },

    filters: {
      i18n: function i18n(value) {
        return _i18n[value][language] || _i18n[value][_i18n.default];
      }
    },

    methods: {
      loadPopular: function loadPopular() {
        var _this = this;

        if (this.popular.length > 1) {
          this.loading = false;
          this.libs = this.popular;
          return;
        }

        fetch(this.apiRoot + 'popular').then(function (res) {
          return res.json();
        }).then(function (data) {
          _this.loading = false;
          _this.libs = _this.popular = _this.handleResponse(data.libs);
        });
      },
      onHeaderQueryPress: function onHeaderQueryPress(e) {
        window.scrollTo(0, this.$refs.searchBar.offsetTop);
        this.query += e.key;
        this.$refs.query.focus();
      },


      onQueryPress: function () {
        var timer = null;

        return function () {
          setTimeout(function () {
            if (timer) {
              clearTimeout(timer);
            }

            timer = setTimeout(function () {
              vm.queryLib(vm.query);
            }, 500);
          }, 200);
        };
      }(),

      handleResponse: function handleResponse(libs) {
        var _this2 = this;

        return libs.map(function (lib) {
          lib.domain = _this2.httpDomain;
          lib.showMoreVersions = false;

          return lib;
        });
      },
      queryLib: function queryLib(query) {
        var _this3 = this;

        this.loading = true;
        this.libs = [];
        fetch(this.apiRoot + ('search?q=' + query)).then(function (res) {
          return res.json();
        }).then(function (data) {
          _this3.loading = false;
          _this3.libs = _this3.handleResponse(data.libs);
        });
      },
      hoverToSelect: function hoverToSelect(e) {
        if (document.body.createTextRange) {
          var range = document.body.createTextRange();
          range.moveToElementText(e.target);
          range.select();
        } else if (window.getSelection) {
          var selection = window.getSelection();
          var _range = document.createRange();
          _range.selectNodeContents(e.target);
          selection.removeAllRanges();
          selection.addRange(_range);
        }
      },
      clickToCopy: function clickToCopy(e) {
        document.execCommand('copy');
        this.hoverToSelect(e);
      },
      onStuck: function onStuck() {
        this.searchBarSticky = true;
      },
      onStatic: function onStatic() {
        this.searchBarSticky = false;
      },
      i18n: function i18n(value) {
        return this.$options.filters.i18n(value);
      }
    }
  });
})();
