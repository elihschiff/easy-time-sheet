const express = require('express')
const app = express()
const port = 3000


app.listen(port, () => console.log(`Listening on port ${port}!`))

app.use(express.static('website'))

app.get('/', function(req, res) {
    res.sendFile(__dirname+'/website/html/timesheet.html');
});
