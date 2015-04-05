var app=require('express')();
var route=require('./router/routes.js');
route.handler(app);
app.listen(3000);
console.log('Listening on port 3000...');