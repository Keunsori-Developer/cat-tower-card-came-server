var url = require('url');
function createRoom(req, res) {

    // res.setHeader("Content-Type", "application/json");
    // res.write("{\"a\":1}");
    var messages = [
        'Hello World',
        'From a basic Nosdfsfsffdde.js server',
        'Take Luck'];

    var uri = req.url;
    if (uri != '/create') return;

    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.write('<html><head><title>Simple HTTP Server</title></head>');
    res.write('<body>');
    for (var idx in messages) {
        res.write('\n<h1>' + messages[idx] + '</h1>');
    }
    res.end('\n</body></html>');

};

exports.createRoom = createRoom;