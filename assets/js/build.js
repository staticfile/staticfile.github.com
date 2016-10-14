'use strict';

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
      sticky: false,
      copied: false,

      apiRoot: 'http://api.staticfile.qiniu.io/v1/',
      httpDomain: 'http://cdn.staticfile.org',
      httpsDomain: 'https://staticfile.qnssl.com'
    },

    mounted: function mounted() {
      var _this = this;

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
      this.$refs.searchBar.onModeChange = function (mode) {
        _this.sticky = mode > 0;
      };

      var ac1 = new autoComplete({
        selector: this.$refs.query,
        minChars: 1,
        source: function source(term, response) {
          fetch(vm.apiRoot + ('search?q=' + term)).then(function (res) {
            return res.json();
          }).then(function (data) {
            response(data.libs.map(function (lib) {
              return lib.name;
            }));
            setTimeout(function () {
              document.querySelector('.autocomplete-suggestion').className += ' selected';
            }, 10);
          });
        },
        onSelect: function onSelect(e, val) {
          vm.query = val;
          vm.fetchLib(val);
        }
      });

      var ac2 = new autoComplete({
        selector: this.$refs.searchBarQuery,
        minChars: 1,
        source: function source(term, response) {
          fetch(vm.apiRoot + ('search?q=' + term)).then(function (res) {
            return res.json();
          }).then(function (data) {
            response(data.libs.map(function (lib) {
              return lib.name;
            }));
          });
        },
        onSelect: function onSelect(e, val) {
          vm.query = val;
          vm.fetchLib(val);
        }
      });

      this.loadPopular();
    },


    watch: {
      query: function query(val) {
        if (!val) return this.loadPopular();
      }
    },

    filters: {
      i18n: function i18n(value) {
        return _i18n[value][language] || _i18n[value][_i18n.default];
      }
    },

    methods: {
      loadPopular: function loadPopular() {
        var _this2 = this;

        if (this.popular.length > 1) {
          this.loading = false;
          this.libs = this.popular;
          return;
        }

        fetch(this.apiRoot + 'popular').then(function (res) {
          return res.json();
        }).then(function (data) {
          _this2.loading = false;
          _this2.libs = _this2.popular = _this2.handleResponse(data.libs);
        });
      },
      handleResponse: function handleResponse(libs) {
        var _this3 = this;

        return libs.map(function (lib) {
          lib.domain = _this3.httpsDomain;
          lib.versions = lib.assets.map(function (asset) {
            return asset.version;
          });
          lib.version = lib.versions[0];
          lib.expanded = false;
          lib.files = lib.assets[0].files;

          return lib;
        });
      },
      queryLib: function queryLib(query) {
        var _this4 = this;

        this.loading = true;
        this.libs = [];
        fetch(this.apiRoot + ('search?q=' + query)).then(function (res) {
          return res.json();
        }).then(function (data) {
          _this4.loading = false;
          _this4.libs = _this4.handleResponse(data.libs);
        });
      },
      fetchLib: function fetchLib(name) {
        var _this5 = this;

        this.loading = true;
        this.libs = [];
        fetch(this.apiRoot + ('packages/' + name)).then(function (res) {
          return res.json();
        }).then(function (data) {
          _this5.loading = false;
          _this5.libs = _this5.handleResponse([data]);
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
      clickToCopy: function clickToCopy(lib) {
        var _this6 = this;

        document.execCommand('copy');
        this.copied = true;
        setTimeout(function () {
          _this6.copied = false;
        }, 2000);
      },
      onStuck: function onStuck() {
        this.searchBarSticky = true;
      },
      onStatic: function onStatic() {
        this.searchBarSticky = false;
      },
      i18n: function i18n(value) {
        return this.$options.filters.i18n(value);
      },
      selectVersion: function selectVersion(lib, version) {
        lib.version = version;
        lib.files = lib.assets.find(function (asset) {
          return asset.version === version;
        }).files;
      },
      openSelect: function openSelect(lib) {
        lib.expanded = !lib.expanded;
      }
    }
  });
})();
