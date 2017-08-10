import csv from 'csv-parse'
import fs from 'fs'
import mongoose from 'mongoose'
import through2 from 'through2'
import Battle from './../models/Battle'
import {uri as dbUri} from './../config/db'

var parser = csv({delimiter: ',',columns:true})
var through = through2.obj(async function write(data, _ , next){
	try{
		let result = await Battle.create({
			name: data.name,
			year: data.year,
			battle_number: data.battle_number,
			attacker_king: data.attacker_king,
			defender_king: data.defender_king,
			attacker: [data.attacker_1,data.attacker_2,data.attacker_3,data.attacker_4],
			defender: [data.defender_1,data.defender_2,data.defender_3,data.defender_4,],
			attacker_outcome: data.attacker_outcome,
			battle_type: data.battle_type,
			major_death: data.major_death,
			major_capture: data.major_capture,
			attacker_size: data.attacker_size,
			defender_size: data.defender_size,
			attacker_commander: data.attacker_commander.split(','),
			defender_commander: data.defender_commander.split(','),
			summer: data.summer,
			location: data.location,
			region: data.region,
			note: data.note
		})
		this.push(`Inserted  ${data.name} \n`)
		next()
	}
	catch(e){
		this.push(`Error processing ${data.name}`)
	}
},function end(){
	process.exit(0)
})
// Databse config
// Create the database connection 
mongoose.connect(dbUri, {
	useMongoClient: true
}); 

// When successfully connected
mongoose.connection.on('open', () => {  
	console.log('Mongoose default connection open to ' + dbUri)
	console.log('Started')

	const fr = fs.createReadStream('./dbData.csv')

	fr.pipe(parser)
	.pipe(through)
	.pipe(process.stdout)
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
	console.log('Mongoose default connection error: ' + err)
	process.exit(0); 
}); 
