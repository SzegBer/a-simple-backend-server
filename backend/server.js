const express = require('express')
const path = require('path')
const fs = require("fs")
const app = express()
const port = 9000

app.use(express.json());

app.get('/', (req, res) => {
	res.sendFile(path.join(`${__dirname}/../frontend/index.html`))
})

app.use('/public', express.static(`${__dirname}/../frontend/public`))

app.get('/api/students', (req, res) => {  			// readingStudents
  res.sendFile(path.join(`${__dirname}/data/students.json`))
})

app.get('/api/students/:id', (req, res) => {  	// searchStudentById
	try {
		const searchId = parseInt(req.params.id)

		if(isNaN(searchId)) {
			res.status(418).send("You must give a number!")
		} else {
			fs.readFile(`${__dirname}/data/students.json`, (err, data) => {
				if (err) {
					console.log('Error reading data', err)
					res.send(err)
				}
				let result = null
				const fileData = JSON.parse(data)
				for (let i = 0; i < fileData.length; i++) {
					const element = fileData[i];
					if(element.id === searchId) {
						//console.log("This is the element in searchID: ", element)
						result = element
					}
				}
				
				if(result === null) {
					res.status(404).send("No student under this ID")
				} else {
					res.send(result)
				}
			})
		}

	} catch(error) {
		console.log(error)
		res.send("Something went terribly wrong")
	}
})

app.get('/api/status/active', (req, res) => {  	// searchStudentByStatus
		
	fs.readFile(`${__dirname}/data/students.json`, (err, data) => {
		if (err) {
			console.log('Error reading data', err)
			res.send(err)
		}

		let result = [];
		const fileData = JSON.parse(data)

		for (let i = 0; i < fileData.length; i++) {
			const element = fileData[i];
			if(element.status === true) {
				result.push(element)
			}
		}

		if(result === null) {
			res.status(404).send("No student under this Status")
		} else {
			res.send(result)
		}
	})
})

app.get('/api/status/finished', (req, res) => {  	// searchStudentByStatus
	
	fs.readFile(`${__dirname}/data/students.json`, (err, data) => {
		if (err) {
			console.log('Error reading data', err)
			res.send(err)
		}

		let result = [];
		const fileData = JSON.parse(data)

		for (let i = 0; i < fileData.length; i++) {
			const element = fileData[i];
			if(element.status === false) {
				result.push(element)
			}
		}

		if(result === null) {
			res.status(404).send("No student under this Status")
		} else {
			res.send(result)
		}
	})
})

app.post('/api/students/new', (req, res) => {		// addNewStudent

	fs.readFile(`${__dirname}/data/students.json`, (err, data) => {
		if(err){
			res.send('Error reading the database')
		} else {
			const userData = JSON.parse(data)
			const lastId = userData[userData.length-1].id
			console.log('He', req.body)
			userData.push({id: lastId+1, ...req.body})

			fs.writeFile(`${__dirname}/data/students.json`, JSON.stringify(userData, null, 2), error => {
				if(error){
					res.send("Error writing the database")
				} else {
					res.send(userData)
				}
			})
		}
	})
})

app.listen(port, () => {
  console.log(`http://127.0.0.1:${port}`)
})