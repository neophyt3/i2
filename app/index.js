import express from 'express'
import path from 'path'
import logger from 'morgan'
import mongoose from 'mongoose'
import Promise from 'bluebird'

let app = new express()
	app.use(express.static(path.join(__dirname, 'public')))
	app.use(logger('dev'))

import index from './routes/index'
app.use('/', index)

// Catch 404
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Error handler
app.use((err, req, res, next) => { 
  	res
    .status(err.status || 500)
    .send(err.message)
});

const { PORT = 3000 } = process.env;

// Databse config
import { uri as dbUri } from './config/db.js';

// Create the database connection 
mongoose.connect(dbUri, {
	useMongoClient: true
}); 

// When successfully connected
mongoose.connection.on('open', () => {  
	console.log('Mongoose default connection open to ' + dbUri);
	mongoose.Promise = Promise
	app.listen(PORT, () => {})
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
	console.log('Mongoose default connection error: ' + err);
	process.exit(0); 
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
	console.log('Mongoose default connection disconnected'); 
});

process.on('uncaughtException', function(error){
	console.log('Boom!')
	console.log(error)
})