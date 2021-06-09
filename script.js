document.addEventListener("DOMContentLoaded", () => {
  const inputForm = document.getElementById("input-form");
  const outputForm = document.getElementById("output-form");
  const btn = document.getElementById("conversion-btn");
  const option = {
    className: {
      p: "",
      h1: "",
      h2: "",
      h3: "",
      h4: "",
      h5: "",
    },
    isKeepEmptyLine: true,
    replaceTagEmptyLine: "<br>",
  };

  btn.addEventListener("click", () => {
    const inputText = inputForm.value;
    let outputText = "";

    const lines = inputText.split(/\r\n|\n/);
    lines.forEach((v) => {
      if (v.match(/\S/g)) {
        outputText += `<p>${v}</p>\n`;
      } else if (option.isKeepEmptyLine) {
        outputText += `${option.replaceTagEmptyLine}\n`;
      }
    });
    console.log(inputText, outputText);

    outputForm.value = outputText;
  });
});
