function extractAndReplace(text) {
  console.log("extract and replace");
  const pattern = /<c([^>]+?) edit='([^>]+?)'>([^<]+?)<\/c>/g;
  let replacedText = text;

  while ((match = pattern.exec(text)) !== null) {
    const type = match[1];
    const edit = match[2];
    const originalText = match[3];
    const replacement = ` <span class="correction tooltip" id="${originalText}" data-original="${originalText}"  data-edit="${edit}" onclick="handleSpanClick('${originalText}','${edit}')">${originalText}</span></Tooltip>`;
    replacedText = replacedText.replace(match[0], replacement);
  }

  return replacedText;
}

module.exports = { extractAndReplace };
