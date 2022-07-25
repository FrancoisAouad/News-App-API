# Eurisko-REST-API
The goal for this project is to create a basic REST API using nodeJS as the runtime environment, as well as having mongoDB as the main database for this project. The API also uses these main technologies:

1-JWT for authentication

2-JEST library for case testing

3-Redis database for caching

4-ExpressJS as the backend framework

5-bcrypt Library to encrypt sensitive user information

6-Nodemailer for sending mail notifications

7-Joi for input validation

8-Dotenv for environmental variables


## Install & Setup
1-Download the project and open in VScode, or any of your preferred IDEs.

2-You must have [nodeJS](https://nodejs.org/en/download/) installed in order to run the project

3-Open a terminal and use the following command

```bash
cd server
```
4-Use the following command in order to install the project dependencies, and devDependencies


```bash
npm install
```
5-The project also uses Redis as a secondary database. You must download the Redis source file either for [Linux](https://redis.io/download/) based systems,  or for [Windows](https://github.com/microsoftarchive/redis/releases/tag/win-3.0.504)

6-You can also use a GUI app for Redis. [Redis Commander](https://www.npmjs.com/package/redis-commander), or [AnotherRedisDesktopManager](https://github.com/qishibo/AnotherRedisDesktopManager)

7-Open two command terminal and copy the following commands in each one of them respectively
```bash
redis-server
```
```bash
redis-cli
```
## Table of Contents

-Server

-Config

-Controllers

-Middleware

-Models

-Routes

-Test

-Utils

