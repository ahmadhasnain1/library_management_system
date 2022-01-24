const express = require('express');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');
var bookRoutes = require('./routes/book');
const dotenv = require('dotenv');
dotenv.config();

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Library Management System APIS",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		servers: [
			{
				url: "http://localhost:8000",
			},
		],
	},
	apis: ["./routes/*.js"],
};

// const specs = swaggerJsDoc(options);

const app = express();
const port = process.env.PORT;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.get('/', (req, res) => {
	res.send('Hello World!')
  });

app.use('/user',userRoutes);
app.use('/admin',adminRoutes);
app.use('/book',bookRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});