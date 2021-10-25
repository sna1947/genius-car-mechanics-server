const express = require('express');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb');

const cors = require('cors');
require('dotenv').config()
const app = express();
const port = 5000; // or process.evn.PORI || 3000; 

//MIDDLEWARE
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5yjkp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 
//** function */
async function run() {
    try {
      await client.connect();
      const database = client.db("carMechanic");
      const servicesCollection = database.collection("services");
       

      //GET API OR ALL DATA/SERVICE
       app.get('/services', async (req, res)=>{
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
       });

       //GET SINGEL DETA/SERVICE=====
       app.get('/services/:id', async (req,res)=>{
         const id = req.params.id;
         console.log('getting specific service', id);
         const query = {_id:Object(id)};
         const service = await servicesCollection.findOne(query);
         res.json(service);
       });

      //POST API ======================
      app.post('/services', async (req, res)=>{
        const service = req.body;
       console.log('hit the post api',service); 

       const result = await servicesCollection.insertOne(service);
      console.log(result);
      // res.send('post hitted')
      res.json(result); 
      });

    } 
    finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello From Genius Server')
})
 
app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
  console.log('Running Genius Server port', port)
})
