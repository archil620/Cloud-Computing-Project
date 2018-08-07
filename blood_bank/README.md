# Rest Api Node and Mysql

## Description
This is an Restful API for Node.js and Mysql. Designed after PHP's beautiful Laravel. This is in the MVC format,
that is views, just models and controllers.

##### Routing         : Express
##### ORM Database    : Sequelize
##### Authentication  : Passport

#### Install Node Modules
```
npm install
npm install pm2 -g
```

#### Create .env File
You have to reconfig of configuration of database and hostname
Fill in the variables to fit your application

### Configuration of Database
All tables are created when you run project firstly.
Before running app, you have to create database named 'blood_bank'
```
create database blood_bank
```

### Run the App
```
npm start
```

### Test the Node process
```
npm run test
```