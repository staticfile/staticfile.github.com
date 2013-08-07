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

    return $.getJSON('http://api.staticfile.org/v1/' + tag).done(function(data) {
      $scope.$apply(function(){
        $scope.libs = data['libs'];
      });
    });
  };

  // page loaded
  fetch();

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
angular.module('static', []).filter('legalname', function(){
  return function(input) {
    return input.replace(/\./g, '_');
  }
});

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

// tracker
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-39768626-1', 'staticfile.org');
ga('send', 'pageview');