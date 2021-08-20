const express       =       require('express')
const app           =       express()
require('dotenv').config()
const db            =       require('./src/db')
const axios         =       require('axios')
const spotify       =       require('spotify-web-api-node')
const queryString   =       require('querystring')

let spotifyApi = new spotify({
  clientId: '325e6a882b3b4981bd3dd5647ec42ba5',
  clientSecret: '7afed6b8775f41a6adfe44d8f1b75644',
  redirectUri: 'http://localhost:4000/data'
});

app.get('/login', function(req, res) {
var scopes = 'user-read-private user-read-email';
res.redirect('https://accounts.spotify.com/authorize' +
  '?response_type=code' +
  '&client_id=' + '325e6a882b3b4981bd3dd5647ec42ba5' +
  (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
  '&redirect_uri=' + encodeURIComponent('http://localhost:4000/data'));

});

app.get('/data',(req,res)=>{
    console.log(req.query.code)

const headers = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  }
};

let data = {
  grant_type: "client_credentials",
  code: req.query.code,
  redirectUri: "http://localhost:8000/callback",
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
};

axios.post('https://accounts.spotify.com/api/token',queryString.stringify(data),headers)
  .then(function (response) {
    console.log(response.data);
    spotifyApi.setAccessToken(response.data.access_token)
    res.redirect('/')
  })
  .catch(function (error) {
    console.log(error);
  });
})

app.get('/',(req,res)=>{

spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
  function(data) {
    console.log('Artist albums', data.body);
    return res.json({
        data:data.body
    })
  },
  function(err) {
    console.error(err);
  }
);
})

app.get('/get-artists', async(req,res)=>{
spotifyApi.searchArtists('Love')
  .then(function(data) {
    console.log('Search artists by "Love"', data.body);
    return res.json(data.body)
  }, function(err) {
    console.error(err);
  });
})

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`)
})