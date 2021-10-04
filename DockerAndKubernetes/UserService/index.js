const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.json([
  {
  name: "Bob",
  email: "bobemail@gmail.com"
},
{
  name: "Alice",
  email: "alice@hotmail.com"
},
{
  name: "Amy",
  email: "amy@wp.com"
}
]))

app.listen(port, () => {
  console.log(`Example app listiening at http://localhost:${port}`) 
})