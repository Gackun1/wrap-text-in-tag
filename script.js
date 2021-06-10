document.addEventListener("DOMContentLoaded", () => {
  const inputForm = document.getElementById("input-form");
  const outputForm = document.getElementById("output-form");
  const conversionBtn = document.getElementById("conversion-btn");
  const optionBtn = document.getElementById("option-btn");
  const copyBtn = document.getElementById("copy-btn");
  const option = {
    isKeepEmptyLine: false,
    replaceTagEmptyLine: "<br>",
    wrapTagLine: "<p>",
  };

  const setOption = () => {
    const keepEmptyLine = document.getElementById("keep-empty-line");
    const replaceTag = document.getElementById("replace-tag-empty-line");
    const wrapTag = document.getElementById("wrap-tag-line");
    option.isKeepEmptyLine = keepEmptyLine.checked;
    option.replaceTagEmptyLine = replaceTag.value;
    option.wrapTagLine = wrapTag.value;
  };

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

  conversionBtn.addEventListener("click", () => {
    let outputText = "";
    const inputText = inputForm.value;
    const startTag = option.wrapTagLine;
    const endTag = createEndTag(option.wrapTagLine);
    const lines = inputText.split(/\r\n|\n/);

    lines.forEach((v) => {
      if (v.match(/\S/g)) {
        outputText += `${startTag}${v}${endTag}\n`;
      } else if (option.isKeepEmptyLine) {
        outputText += `${option.replaceTagEmptyLine}\n`;
      }
    });

    outputForm.value = outputText;
  });

  optionBtn.addEventListener("click", setOption);

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
