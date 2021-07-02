const express = require('express');
const { readdirSync } = require('fs');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const colors = require('colors');

// app initialize
const app = express();
// environment variable
dotenv.config({ path: './env/dotenv.env' });

// apply common middleware
app.use(cors());
app.use(express.json());
if (process.env.ENV === 'development') {
	app.use(morgan('combined'));
}

// route
readdirSync('./routes').map(r => app.use(`/api`, require(`./routes/${r}`)));
// app.use('/api', authRoute);
// app.get('/', (req, res) => {
// 	res.send('hello there !');
// });

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`.rainbow);
});
