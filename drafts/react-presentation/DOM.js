Browser.DOM = function (html, scope) {
  // Creates empty node and injects html string using .innerHTML
  // in case the variable isn't a string we assume is already a node
  var node;
  if (html.constructor === String) {
    var node = document.createElement("div");
    node.innerHTML = html;
  } else {
    node = html;
  }

  // Creates of uses and object to which we will create variables
  // that will point to the created nodes

  var _scope = scope || {};

  // Recursive function that will read every node and when a node
  // contains the var attribute add a reference in the scope object

  function toScope(node, scope) {
    var children = node.children;
    for (var iChild = 0; iChild < children.length; iChild++) {
      if (children[iChild].getAttribute("var")) {
        var names = children[iChild].getAttribute("var").split(".");
        var obj = scope;
        while (names.length > 0) {
          var _property = names.shift();
          if (names.length == 0) {
            obj[_property] = children[iChild];
          } else {
            if (!obj.hasOwnProperty(_property)) {
              obj[_property] = {};
            }
            obj = obj[_property];
          }
        }
      }
      toScope(children[iChild], scope);
    }
  }

  toScope(node, _scope);

  if (html.constructor != String) {
    return html;
  }
  // If the node in the highest hierarchy is one return it

  if (node.childNodes.length == 1) {
    // if a scope to add node variables is not set
    // attach the object we created into the highest hierarchy node

    // by adding the nodes property.
    if (!scope) {
      node.childNodes[0].nodes = _scope;
    }
    return node.childNodes[0];
  }

  // if the node in highest hierarchy is more than one return a fragment
  var fragment = document.createDocumentFragment();
  var children = node.childNodes;

  // add notes into DocumentFragment
  while (children.length > 0) {
    if (fragment.append) {
      fragment.append(children[0]);
    } else {
      fragment.appendChild(children[0]);
    }
  }

  fragment.nodes = _scope;
  return fragment;
};

var UI = {};
var template = "";
template += '<div class="repository">';
template += ' <div var="name"></div>';
template += ' <p var="text"></p>';
template += ' <img var="image"/>';
template += "</div>";

var item = Browser.DOM(template, UI);

UI.name.innerHTML = data.name;
UI.text.innerHTML = data.description;
UI.image.src = data.owner.avatar_url;
