function extractAndReplace(text) {
  console.log("extract and replace");
  const pattern = /<c([^>]+?) edit='([^>]+?)'>([^<]+?)<\/c>/g;
  let replacedText = text;

  while ((match = pattern.exec(text)) !== null) {
    const type = match[1];
    const edit = match[2];
    const originalText = match[3];
    const replacement = `<span class="correction" data-original="${originalText}" data-type="${type}" data-edit="${edit}">${originalText}<span class="tooltip" >${edit}</span></span>`;
    replacedText = replacedText.replace(match[0], replacement);
  }

  return replacedText;
}

module.exports = { extractAndReplace };
