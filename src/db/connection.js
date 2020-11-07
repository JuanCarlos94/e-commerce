const mongoose = require('mongoose')

const uri = ''

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection

db.once('open', function(){
    console.log('DB connection success!')
})
