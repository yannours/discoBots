var system = require('system');
var args = system.args;
var webPage = require('webpage');
var page = webPage.create();

page.open(args[1], function (status) {
  if (status != 'success') {
    phantom.exit();
    return (false);
  }
  var foo = page.evaluate(function() {
    var ret = [];
    var nodes = document.getElementsByTagName('article');
    if (nodes[0].className == "invading") {
      ret.push("Invasion alive for ");
    } else {
      ret.push("Invasion in ");
    }
    nodes = document.getElementsByClassName('hours');
    ret.push(nodes[0].textContent.replace(/\s+/g, ' ').trim());
    nodes = document.getElementsByClassName('minutes');
    ret.push(nodes[0].textContent.replace(/\s+/g, ' ').trim());
    nodes = document.getElementsByClassName('seconds');
    ret.push(nodes[0].textContent.replace(/\s+/g, ' ').trim());
    return (ret);
  });
  console.log(foo.join(" "));
  phantom.exit();
});
