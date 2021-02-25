function ConvertCsharpJson(data) {
    return data.replace(/'/g, '"');
}

module.exports = ConvertCsharpJson;