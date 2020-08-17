const restify = require('restify');
const mongoose = require('mongoose');
const User = require('./model/user.modul');
const rJWT = require('restify-jwt-community');
const jwt = require('jsonwebtoken');

const { compareSync,genSaltSync, hashSync }= require('bcrypt-nodejs'); 
require('dotenv').config();
mongoose.connect(process.env.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=> console.log(`mdb is started`));
const salt = genSaltSync(10);
const app = restify.createServer();
app.post('/login', async(req,res) =>{
  const { email, password } = req.body;
  const candidate = await	User.findOne({ email });
  try {
    if (compareSync(password,candidate.password) && candidate.email === email){
      const token = jwt.sign({ email: candidate.email }, process.env.secret);
      res.json({ token: token });
    } else {
      res.json({ message: 'email or password is not correct' });
    }
    // console.log(compareSync(candidate.password, password));
  } catch (e){
    res.send(e);
  }
});
app.use(restify.plugins.queryParser({
  mapParams: true
}));
app.use(restify.plugins.bodyParser({
  mapParams: true
}));
app.use(restify.plugins.acceptParser(app.acceptable));

app.listen(3000, ()=>console.log('server is run'));