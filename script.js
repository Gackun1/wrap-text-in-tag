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
    optionWord: "",
    optionTag: "",
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

    const optionWord = document.getElementById("option-word");
    option.optionWord = optionWord.value;

    const optionTag = document.getElementById("option-tag");
    option.optionTag = optionTag.value;
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
    if (!option.useOptionWord) {
      return;
    }
    const firstWord = str.slice(0, option.optionWord.length);
    return firstWord === option.optionWord ? true : false;
  };

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
        outputText += `${option.optionTag}${v.slice(-v.length + option.optionWord.length)}${createEndTag(option.optionTag)}\n`;
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
