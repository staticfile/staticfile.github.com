

// fetch lib data
function libListCtrl($scope) {

  var popular = 'jquery'; // change it to popular list

  var fetch = function(tag) {

    tag = tag || popular;

    return $.getJSON('http://api.staticfile.org/v1/search?q=' + tag).done(function(data) {
      $scope.$apply(function(){
        $scope.libs = data['libs'];
      });
    });
  };

  // page loaded
  fetch();

  // query change
  $scope.fetchLibs = function(e) {
    fetch(e.query);
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

// older file(s)
$('#search').on('click', '[data-toggle="showhide"]', function(e) {
  e.preventDefault();
  var $target = $($(this).attr('href'));

  $target.is(':visible') ? $target.show('fast') : $target.slideUp('fast');
});

// tracker
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-39768626-1', 'staticfile.org');
ga('send', 'pageview');