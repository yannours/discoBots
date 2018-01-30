var system = require('system');
var args = system.args;
var webPage = require('webpage');
var page = webPage.create();

page.open(args[1], function (status) {
  console.log(args);
  console.log(status);
  if (status != 'success') {
    phantom.exit();
    return (false);
  }
  //console.log(page.content);
  var foo = page.evaluate(function() {
    //document.getElementsByClassName('hours')
    return ("test");
  });
  console.log(foo);
  phantom.exit();
});
