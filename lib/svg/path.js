var _ = require('lodash')


function parseNode(node) {
  var path = ''

  if (node.tagName === 'path') {
    if (node.getAttribute('fill') === 'none' && node.getAttribute('stroke') === 'none'){
      return path
    } else {
      path = node.getAttribute('d')
    }
  }

  if (node.hasChildNodes()) {
    _.each(node.childNodes, function(childNode) {
      path += parseNode(childNode)
    })
  }

  return path
}


exports.normalizePath = function(svgNode) {

  return parseNode(svgNode)
}