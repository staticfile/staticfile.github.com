if(window.localStorage) localStorage.clear();

var clip, current;

ZeroClipboard.setDefaults({
  moviePath: 'js/copy/ZeroClipboard.swf'
});

clip = new ZeroClipboard();
clip.addEventListener('complete', function(client, copy) {
  alert('链接地址已复制：\n\n' + copy.text);
});

$(document).on('mouseover', '.btn', function(){
  var offset, swf, item, menu;

  item = $(this);
  offset = item.offset()
  swf = $('#global-zeroclipboard-html-bridge');
  menu = $('.tt-dropdown-menu');
  padding = menu.offset();

  if(!menu.find(swf).length) menu.append(swf);

  swf.css({
    top: parseInt(offset.top - padding.top, 10) + 'px',
    left: parseInt(offset.left - padding.left, 10) + 'px',
    width: item.width() + 3 + 'px',
    height: item.height() + 3 + 'px'
  })

  clip.setText($(this).data('url'));
  clip.glue(item[0]);
})

$('#key').typeahead({
  name: 'statics',
  prefetch: 'libs.json',
  template: '<div class="item"><p><strong>{{value}}</strong> <span id="{{value}}" class="btn btn-tips" data-url="http://libs.qiniudn.com/{{value}}/{{version}}/{{filename}}">复制最新版：{{version}}</span></p>' +
    '<div class="item-inner">点击复制：{{#vers}}<span class="btn" data-url="http://libs.qiniudn.com/{{value}}/{{ver}}/{{filename}}">{{ver}}</span> {{/vers}}' +
    '<cite class="nocopy">不能复制?</cite>' +
    '<ul class="list">{{#vers}}<li>http://libs.qiniudn.com/{{value}}/{{ver}}/{{filename}}</li>{{/vers}}' +
    '</ul></div></div>',
  engine: Hogan,
  limit: 10000
}).on('keydown', function(e) {
    if (e.keyCode == 38 || e.keyCode == 40) {
      $('.item-inner').hide();
      $('.tt-is-under-cursor .item-inner').show();
    }
  }
);

$('body').on('mouseenter', '.nocopy', function() {
  var list = $(this).parent().find('.list')
    , action = list.is(':visible') ? 'slideUp' : 'slideDown';
  list[action]('fast');
})

$('.tt-dropdown-menu').on('mousemove', function() {
    $('.item-inner').hide();
    $('.tt-is-under-cursor .item-inner').show();
  }
);

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-39768626-1', 'staticfile.org');
ga('send', 'pageview');