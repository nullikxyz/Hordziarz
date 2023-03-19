const mongoose = require('mongoose')
const { mongoDB } = require('./config.json')

module.exports = async ({ logger }) => {
    mongoose.set("strictQuery", true);

    mongoose.connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    mongoose.connection.on('connected', () => logger.info('Połączono z bazą danych'))
    mongoose.connection.on('err', err => logger.error(err))
    mongoose.connection.on('disconnected', () => logger.info('Rozłączono z bazą danych'))

    Promise.resolve();
}