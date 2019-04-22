const mongoose = require("mongoose");
module.exports = {
    connect: (dbPath)=>{
        mongoose.connect(dbPath, {useNewUrlParser: true});

        const db = mongoose.connection;
        db.on("error", () => console.log("failed to connect to database"));
        db.once("open", ()=> console.log("Database connection successful"));
        return db;
    }
};