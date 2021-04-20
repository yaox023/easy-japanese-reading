

// const jpMap = require("./jp2chnMap.json");

const url = chrome.extension.getURL('./jp2chnMap.json');
let jpMap;
fetch(url)
  .then(r => r.json())
  .then(r => jpMap = r);
// let jpMap = require("./jp2chnMap.json");

function match(str) {
  while (true) {
    const o = jpMap[str];
    if (o) {
      return { hiragana: str, kanji: o };
    } else {
      const end = str.length - 1;
      if (end < 1) return;
      str = str.slice(0, end);
    }
  }
};
function testMatch() {
  const str = '警視庁は30代の中国共産党員';
  const o = match(str);
  console.assert(o.hiragana === '警視');
  console.assert(o.kanji === 'けいし');
}
// testMatch()



function transformText(text) {
  const outcome = [];
  const window = 10;
  let offset = 0;

  while (true) {
    const end = (offset + window) > text.length ? text.length : (offset + window);
    let str = text.slice(offset, end);
    if (str.length === 0) break;

    const o = match(str);
    if (o) {
      offset += o.hiragana.length;
      outcome.push(o);
    } else {
      offset += 1;
      outcome.push({ hiragana: str[0], kanji: "" });
    }
  }
  return outcome;
}

function testTransformText() {
  const text = '警視庁は30代の中国共産党員の男を私電磁的記録不正作出';
  const o = transformText(text);
  console.log(o);
  console.assert(p[0].hiragana === '警視');
  console.assert(p[0].kanji === 'けいし');
}
// testTransformText();

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    sendResponse({ target: request.src.map(text => transformText(text)) });
  }
);



// ----
// jp2chn 转为 jp2chnMap
// const json = require("./jp2chn.json");
// const fs = require("fs");

// const o = {};
// for (let i=0; i<json.length; i++) {
//   const one = json[i];
//   o[one['汉字日语']] = one['假名日语']
// }
// // console.log(o);

// fs.writeFile('./jp2chnMap.json', JSON.stringify(o), 'utf8', (err) => {
//   // ...
// });
// ----

