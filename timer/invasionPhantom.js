var system = require('system');
var args = system.args;
var webPage = require('webpage');
var page = webPage.create();

//virtual page created
page.open(args[1], function (status) {
  if (status != 'success') {
    phantom.exit();
    return (false);
  }
  //we request elments of page
  var foo = page.evaluate(function() {
    var ret = [];
    var nodes = document.getElementsByTagName('article');
    //if article got classname invading seems to be a good trigger for invasion active
    if (nodes[0].className == "invading") {
      //invasion is alive
      ret.push("Invasion alive for ");
    } else {
      //next invasion in 
      ret.push("Next invasion in ");
    }
    nodes = document.getElementsByClassName('hours');
    //we push hours remaining
    ret.push(nodes[0].textContent.replace(/\s+/g, ' ').trim());
    nodes = document.getElementsByClassName('minutes');
    //we push hours remaining
    ret.push(nodes[0].textContent.replace(/\s+/g, ' ').trim());
    nodes = document.getElementsByClassName('seconds');
    //we push hours remaining
    ret.push(nodes[0].textContent.replace(/\s+/g, ' ').trim());
    return (ret);
  });
  //we return the consolidated string with full info
  console.log(foo.join(" "));
  phantom.exit();
});
