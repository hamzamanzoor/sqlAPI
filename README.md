# sqlAPI
API endpoint for aggregation over SQL database with the following request format:

GET /api/stats?ad_ids=1,2,3&start_time=2013-09-01&end_time=2013-10-01

Only accepts above mentioned request format.

Import the database file and change the database configuration in config/dbconfig.js