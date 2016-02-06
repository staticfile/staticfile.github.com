// 顺延函数：如果上一个动作完成，则当前动作替换上一个
function shift(fn, time) {
  time = time || 200;
  var queue = window._shift_fn, current;
  queue ? queue.concat([fn, time]) : (queue = [[fn, time]]);
  current = queue.pop();
  clearTimeout(window._shift_timeout);
  window._shift_timeout = setTimeout(function() {
    current[0]();
  }, current[1]);
}

// fetch lib data
function libListCtrl($scope) {

  var popular = 'popular'; // change it to popular list

  var fetch = function(tag) {

    tag = tag ? ('search?q=' + tag) : (($scope.isPopular = true), popular);

    return $.getJSON('http://api.staticfile.qiniu.io/v1/' + tag).done(function(data) {
      $scope.$apply(function(){
        $scope.libs = data['libs'];
      });
    });
  };

  // page loaded
  fetch();

  $scope.httpDomain = 'http://cdn.staticfile.org';
  $scope.httpsDomain = 'https://staticfile.qnssl.com';
  $scope.domain = $scope.httpDomain;

  // query change
  $scope.fetchLibs = function(e) {

    $scope.isPopular = false;

    // 搜索顺延
    shift(function(){
      fetch(e.query);
    })
  }
}

//libListCtrl.$inject = ['$scope'];

// return a legal name
angular.module('static', [])
.filter('legalname', function(){
  return function(input) {
    return input.replace(/\./g, '_');
  }
})
.controller('libListCtrl', libListCtrl);

// select url text
$(document).on('mouseenter', 'pre', function(e) {
  var doc = document
    , text = $(this).find('code')
    , range, selection;

  if(!text.length) return;

  text = text[0];

  // http://stackoverflow.com/a/987376/1189321
  if (doc.body.createTextRange) {
    range = doc.body.createTextRange();
    range.moveToElementText(text);
    range.select();
  } else if (window.getSelection) {
    selection = window.getSelection();
    range = doc.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

// file(s)
$('#search').on('click', '[data-toggle="showhide"]', function(e) {
  e.preventDefault();
  var $target = $($(this).attr('href'));

  $target.is(':visible') ? $target.slideUp('fast') : $target.show('fast');
});
