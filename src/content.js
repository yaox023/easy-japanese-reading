// key: parent node, value: text child node
function getNodes(root) {
  if (!root) return []
  const nodes = [];

  function walk(parent) {
    const childsLength = parent.childNodes.length;
    const childNodes = [...parent.childNodes];

    for (let i = 0; i < childsLength; i++) {
      const child = childNodes[i];

      if (child.nodeType === 3 && !/^\s*$/.test(child.data)) {
        nodes.push({
          parent, child
        });
      }

      if (child.nodeType === 1) {
        walk(child);
      }
    }
  }

  walk(root);
  return nodes;
}

function createRuby(hiragana, kanji) {
  const ruby = document.createElement('ruby');
  ruby.appendChild(document.createTextNode(hiragana));
  const rt = document.createElement("rt");
  rt.appendChild(document.createTextNode(kanji));
  ruby.appendChild(rt);
  return ruby;
}

const nodes = getNodes(document.querySelector(".content--detail-main"));
console.log(nodes);

chrome.runtime.sendMessage({ src: nodes.map(node => node.child.data) }, function (response) {
  console.log(response.target);
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const targetNodes = response.target[i];
    for (let j = 0; j < targetNodes.length; j++) {
      const target = targetNodes[j];
      if (target.kanji.length > 0) {
        const ruby = createRuby(target.hiragana, target.kanji);
        node.parent.insertBefore(ruby, node.child);
      } else {
        node.parent.insertBefore(document.createTextNode(target.hiragana), node.child);
      }
    }
    node.parent.removeChild(node.child);
  }
});





