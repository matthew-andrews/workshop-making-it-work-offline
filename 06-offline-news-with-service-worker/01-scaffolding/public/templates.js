(function() {
  var exports = {
    list: list,
    article: article
  };

  function list(data) {
    var ul = '';
    data.forEach(function(story) {
      ul += '<li><a class="js-link" href="/article/'+story.guid+'">'+story.title+'</a></li>';
    });
    return shell({
      main: '<h1>FT Tech Blog</h1><ul>'+ul+'</ul>'
    });
  }

  function article(data) {
    return shell({
      title: data.title,
      main: '<nav><a class="js-link" href="/">&raquo; Back to FT Tech Blog</a></nav><h1>'+data.title+'</h1>'+data.body
    });
  }

  function shell(data) {
    data = {
      title: data && data.title || 'FT Tech News',
      main: data && data.main || ''
    };
    return '<!DOCTYPE html>'
      + '\n<html>'
      + '\n  <head>'
      + '\n    <title>'+data.title+'</title>'
      + '\n    <link rel="stylesheet" href="/styles.css" type="text/css" media="all" />'
      + '\n  </head>'
      + '\n  <body>'
      + '\n    <main>'+data.main+'</main>'
      + '\n    <script src="/templates.js"></script>'
      + '\n    <script src="/application.js"></script>'
      + '\n  </body>'
      + '\n</html>';
  }

  if (typeof module == 'object') {
    module.exports = exports;
  } else {
    this.templates = exports;
  }
}());
