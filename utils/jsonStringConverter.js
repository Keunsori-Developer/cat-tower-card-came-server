function ConvertCsharpJson(data) {
    var str = data.replace(/'/g, '"');
    return JSON.parse(str);
}

module.exports = ConvertCsharpJson;