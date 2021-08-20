const mongoose      =   require('mongoose')
require('dotenv').config()

options = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}

try {
    mongoose.connect(process.env.MONGO_URI,options)
    console.log('connected to database')
} catch (error) {
    console.log(error)
}