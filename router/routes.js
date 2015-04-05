var sql = require('../controllers/sql');

function handler(app) {

	app.get('/api/stats', sql.getRecords);
	app.use('/*', function (req, res) {
		res.send('Sorry, 404 Not Found');
	});
}

exports.handler=handler;
