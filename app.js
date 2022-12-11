const express = require("express");
const axios = require("axios");
const path = require("path");
var FormData = require("form-data");
const app = express();
const port = process.env.PORT || 8080;

// use the short memory to store information
var id = undefined;
var secret = undefined;
var token = undefined;
var email = undefined;
var name = undefined;

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/credential", function (req, res) {
  identity = { id: id, secret: secret, token: token };
  res.json(identity);
});

app.get("/name", function (req, res) {
  res.send(name);
});

app.get("/index.js", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.js"));
});

app.get("/search.html", function (req, res) {
  res.sendFile(path.join(__dirname, "/search.html"));
});

app.get("/search.js", function (req, res) {
  res.sendFile(path.join(__dirname, "/search.js"));
});

app.get("/toSearch", async function (req, res) {
  console.log(req.query);
  email = req.query.email;
  name = await searchNameByEmail();
  res.sendFile(path.join(__dirname, "/search.html"));
});

app.get("/toZoho", function (req, res) {
  console.log(req.query);
  id = req.query.id;
  secret = req.query.secret;
  // redirect to the zoho authentication page
  // the page will redirect back automatically after the authentication being checked
  res
    .status(301)
    .redirect(
      `https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.contacts.ALL&scope=ZohoSearch.securesearch.READ&client_id=${id}&response_type=code&access_type=online&redirect_uri=http://localhost:8080/toToken`
    );
});

app.get("/toToken", async function (req, res) {
  // get the url of query page
  const url = req.url;
  const url_processed = url.split("=")[1];
  const code = url_processed.split("&")[0];
  // fetch and store the access token
  token = await fetchToken(id, secret, code);
  // response the static page again, the token will be caught
  res.sendFile(path.join(__dirname, "/index.html"));
});

async function searchNameByEmail() {
  // REST API to query Zoho information
  var config = {
    method: "get",
    url: `https://www.zohoapis.com.au/crm/v2/Contacts/search?email=${email}`,
    headers: {
      Authorization: `Zoho-oauthtoken ${token.replaceAll('"', "")}`,
    },
  };
  return axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return response.data.data[0].First_Name;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
}

async function fetchToken(id, secret, code) {
  var data = new FormData();
  data.append("grant_type", "authorization_code");
  data.append("client_id", id);
  data.append("client_secret", secret);
  data.append("redirect_uri", "http://localhost:8080/toToken");
  data.append("code", code);
  // fetch access token
  var config = {
    method: "post",
    url: "https://accounts.zoho.com.au/oauth/v2/token",
    headers: {
      Cookie:
        "3e285c6f31=7165323247d658488913e2292ba83474; JSESSIONID=7E47CA13EF05C883878BC90E5DAD3DA2; _zcsr_tmp=31b6a837-378a-4f5d-b340-0c6bddd9305f; iamcsr=31b6a837-378a-4f5d-b340-0c6bddd9305f",
      ...data.getHeaders(),
    },
    data: data,
  };

  const token = axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return JSON.stringify(response.data.access_token);
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });
  return token;
}

app.listen(port);
console.log("Server started at http://localhost:" + port);
