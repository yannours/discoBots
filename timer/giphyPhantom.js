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
    //class of a gif img -> _3QcZOBs-_0PFoUjz21NMOt
    var giphyGIFClass = "_3QcZOBs-_0PFoUjz21NMOt";
    var nodes = document.querySelector('img.'+giphyGIFClass);
    ret.push(nodes);
    //for (var i = nodes.length - 1; i >= 0; i--) {
    //  ret.push(nodes[i].getAttribute("src"));
    //}
    return (ret);
  });
  //we return the consolidated string with full info
  //console.log(foo.join("\n"));
  //for (bar in foo[0]) {
  //  console.log(bar);
  //}
  console.log(foo);
  //console.log(foo[0].src);
  phantom.exit();
});

//div -> div -> div: div | div -> div -> ul: li | ul -> li -> div: div | a -> div -> img(src)