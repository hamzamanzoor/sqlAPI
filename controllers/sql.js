var config = require('../config/dbconfig');
var fs = require('fs');
var mysql = require('mysql');

var pool  = mysql.createPool(config.mysql);

function getRecords(req, res) {
	var params = parseQuery(req);
	var query1="SELECT ad_id, action, SUM(count) as count, SUM(value) as value, SUM(value) / SUM(count) as cpa FROM ad_actions WHERE date BETWEEN '"+params.start_time+"' AND '"+params.end_time+"' AND ad_id IN ("+params.ad_ids+") GROUP BY action, ad_id;";
	var query2="SELECT ad_id, SUM(impressions) as impressions, SUM(clicks) as clicks, SUM(spent) as spent, SUM(clicks) / SUM(impressions) as ctr, SUM(spent) / SUM(clicks) as cpc, SUM(impressions) / 1000 / SUM(spent) as cpm FROM ad_statistics WHERE	date BETWEEN '"+params.start_time+"' AND '"+params.end_time+"' AND ad_id IN ("+params.ad_ids+") GROUP BY ad_id;";
	
	pool.getConnection(function(err, connection) {
		if(err) {
			throw new Error("sql connection error " + err);
		};
		connection.query(query1+query2, function(err, result) {
			if(err) {
				throw new Error("sql error " + err);
			}
			parseResult(result,res);
		});
		connection.release();
	});
}

exports.getRecords=getRecords;

function parseQuery(req) {
	var arr = {
		ad_ids: checkIsNum(req.query.ad_ids),
		start_time: checkIsDate(req.query.start_time,1),
		end_time: checkIsDate(req.query.end_time,2)
	};
	return arr;
};

function parseResult(result,res)
{

	var actions = {};
	result[0].forEach( function(item) {
		actions[item.ad_id] = actions[item.ad_id] || {};
		actions[item.ad_id][item.action] = {
			count: item.count,
			value: item.value,
			cpa: item.cpa
		};
	});
	var statistics = {};
	result[1].forEach( function (item) {
		statistics[item.ad_id] = {
			impressions: item.impressions,
			clicks: item.clicks,
			spent: item.spent,
			ctr: item.ctr,
			cpc: item.cpc,
			cpm: item.cpm,
			actions: actions[item.ad_id]
		}
	});
	res.send(statistics);
}

function checkIsNum(ad_ids) {
	var arr= ad_ids.split(",")
	.map(function(value) {
		if(!isNaN(Number(value))) {
			return Number(value);
		} else {
			throw new Error("Not a number");
		}
	});
	return arr;
};

function checkIsDate(date,typ) {
	if(typ==1)
	{
	    if(!isNaN(Date.parse(date.replace("-", "/")))) {
		    return date;
	    } else {
		    throw new Error("Not a date");
		}
    }
    else if(typ==2)
	{
	    if(!isNaN(Date.parse(date.replace("-", "/")))) {
		    return date;
	    } else {
		    throw new Error("Not a date");
		}
    }

};