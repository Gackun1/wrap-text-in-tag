document.addEventListener("DOMContentLoaded", () => {
  const inputForm = document.getElementById("input-form");
  const outputForm = document.getElementById("output-form");
  const conversionBtn = document.getElementById("conversion-btn");
  const saveBtn = document.getElementById("save-btn");
  const copyBtn = document.getElementById("copy-btn");
  const option = {
    // isWrapExistTag: false,
    isKeepEmptyLine: false,
    useOptionWord: true,
    replaceTagEmptyLine: "<br>",
    wrapTag: "<p>",
    optionWords: []
  };
  const regExp = {
    nonSpaceChar: /\S/g,
    tag: /<\/?[^>]*>/,
  };

  //change settings
  const setOption = () => {
    const wrapExistLine = document.getElementById("exist-tag");
    option.isWrapExistTag = wrapExistLine.checked;

    const keepEmptyLine = document.getElementById("empty-line");
    option.isKeepEmptyLine = keepEmptyLine.checked;

    const replaceTag = document.getElementById("replace-empty-line");
    option.replaceTagEmptyLine = replaceTag.value;

    const wrapTag = document.getElementById("wrap-tag");
    option.wrapTag = wrapTag.value;

    const useOptionWord = document.getElementById("use-option-word");
    option.useOptionWord = useOptionWord.checked;

    const findWords = document.querySelectorAll(".find-word");
    const convertWords = document.querySelectorAll(".convert-word");
    const optionWords = [...Array(findWords.length)].map((_v, i) => {
      return { findWord: findWords[i].value, convertWord: convertWords[i].value };
    });
    option.optionWords = optionWords;
  };

  //create end tag
  const createEndTag = (str) => {
    const endTag = [];
    for (let value of [...str]) {
      if ((value === " ") | (value === ">")) {
        break;
      }
      endTag.push(value);
    }
    endTag.splice(1, 0, "/");
    endTag.push(">");

    return endTag.join("");
  };

  //check use option word
  const checkOptionWord = (str) => {
    console.log(str)
    if (!option.useOptionWord) {
      return;
    }

    for (const word of option.optionWords) {
      const firstWord = str.slice(0, word.findWord.length);
      if (firstWord === word.findWord) {
        return word;
      }
    }
  };

  //create option tag
  const createOptionTag = (str) => {
    let result = "";
    const word = checkOptionWord(str);
    const endTag = createEndTag(word.convertWord);
    const endText = str.slice(-endTag.length);
    let text = "";

    if (endText === endTag) {
      text = `${str.slice(word.findWord.length, -endTag.length)}`;
    } else {
      text = `${str.slice(word.findWord.length)}`;
    }
    result = `${word.convertWord}${text}${endTag}`;
    
    return result;
  }

  //conversion button click
  conversionBtn.addEventListener("click", () => {
    let outputText = "";
    const inputText = inputForm.value;
    const startTag = option.wrapTag;
    const endTag = createEndTag(option.wrapTag);
    const lines = inputText.split(/\r\n|\n/);

    lines.forEach((v) => {
      // if (v.match(regExp.tag) && !option.isWrapExistTag) {
      //   //タグが存在している行
      //   outputText += `${v}\n`;
      // } else 
      if (checkOptionWord(v)) {
        //特定の文字列がある行
        outputText += `${createOptionTag(v)}\n`;
      } else {
        if (v.match(regExp.nonSpaceChar)) {
          //空白以外の文字が存在する行
          outputText += `${startTag}${v}${endTag}\n`;
        } else if (option.isKeepEmptyLine) {
          //空の行
          outputText += `${option.replaceTagEmptyLine}\n`;
        }
      }
    });

    outputForm.value = outputText;
  });

  //option button click
  saveBtn.addEventListener("click", setOption);

  //copy button click
  copyBtn.addEventListener("click", () => {
    //select textarea
    outputForm.select();

    //copy on clipboard
    document.execCommand("copy");

    //remove all selection
    window.getSelection().removeAllRanges();

    //show message
    const msg = document.getElementById("copy-msg");
    msg.classList.remove("show");
    setTimeout(() => msg.classList.add("show"), 1);
  });
});
