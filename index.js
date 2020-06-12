const express = require('express');
const userRouter = require('./users/userRouter')


const server = express();
const port = process.env.PORT || 9066

server.use(express.json())
server.use(logger)
server.use("/api/users", userRouter)



server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`${new Date().toISOString()} ${req.ip} ${req.method} ${req.url}`)
  next()
}

server.listen(port, () => {
  console.log("server started at port 9066")
})

module.exports = server;