# Smart Water Monitoring System (SWMS) Data Service

A service that receives data from the ESP8266 module and publishes it to Firebase.

[View on Heroku Dashboard](https://dashboard.heroku.com/apps/swms-data-service)

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ rm -rf node_modules; npm install --production
$ heroku local web
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```sh
$ git add .
$ git commit -m "message"
$ git push origin master
```

Heroku is configured to automatically deploy the latest version of master from this git repo.

## Available Endpoints

* `/test`
```sh
$ curl -X GET https://swms-data-service.herokuapp.com/test
```
```sh
$ curl -X POST https://swms-data-service.herokuapp.com/test
```

* `/test/postData`
```sh
$ curl -X POST https://swms-data-service.herokuapp.com/test/postData -H "Content-type: application/x-www-form-urlencoded" -d "testData=100" 
```

* `/test/firebaseWrite`
```sh
$ curl -X POST https://swms-data-service.herokuapp.com/test/firebaseWrite
```
