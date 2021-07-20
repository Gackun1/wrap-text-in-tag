document.addEventListener("DOMContentLoaded", () => {
  const inputForm = document.getElementById("input-form");
  const outputForm = document.getElementById("output-form");
  const conversionBtn = document.getElementById("conversion-btn");
  const saveBtn = document.getElementById("save-btn");
  const copyBtn = document.getElementById("copy-btn");
  const option = {
    isWrapExistTag: false,
    isKeepEmptyLine: false,
    useOptionWord: false,
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
    
    console.log(option)
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
        // const title = document.getElementById("title").value;
        // console.log(firstWord, title);
        // if (firstWord === title) {
        //   option.title = str.slice(-str.length + word.findWord.length);
        // }
        // console.log(option);
        console.log(word)
        return word;
      }
    }
  };

  //create option tag
  const createOptionTag = (str) => {
    let result = "";
    const word = checkOptionWord(str)    
    result = `${word.convertWord}${str.slice(-str.length + word.findWord.length)}${createEndTag(word.convertWord)}`
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
      if (v.match(regExp.tag) && !option.isWrapExistTag) {
        //タグが存在している行
        outputText += `${v}\n`;
      } else if (checkOptionWord(v)) {
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
