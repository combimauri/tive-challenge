[![CircleCI](https://circleci.com/gh/combimauri/tive-challenge.svg?style=shield)](https://circleci.com/gh/combimauri/tive-challenge)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](/LICENSE)

# Tive Challenge

Project to solve TiveLab's Code Challenge. Based in a list of users, it calculates the scores of all of them and displays that information in a table. Also, the score can be analyzed user by user, accessing a profile page of each one to see their attributes and their positions in global, national and friends ranking.

The algorithms in order to determine **time**, **level**, **score** and position in ranking properties were implemented as an API with **Firebase Cloud Functions**.

The web client to see all the info was implemented with **Angular**.

In order to cache all the requests made to the API, a **service worker** configuration was added (`ngsw-config.json`). All requests to the API are made just once every 24 hours, after that, the response is saved in browser cache and retrieved from there (this configuration is under `dataGroups` in the **service worker** configuration file).

For the **service worker** implementation, Angular provides a configuration file in order to generate it for production builds. Other solution could have been **workbox**, but very few configuration was needed, so this option was not used.

**Important Note:** caching request from the API will only work for **production environment**.

## Environment

- Node: **v12.19.0**
- NPM: **v6.14.8**
- Angular CLI: **11.0.5**

Using other Node or NPM version could lead to modification of package-lock and sub-dependencies, take care about that.

## Install Dependencies

In order to install API and Web Client dependencies, run:

```bash
npm run install-dependencies
```

## Run the App in Development Mode

In order to run the app in development mode, the api and the web client need to be served.

After installing dependencies, to serve the API, run:

```bash
npm run serve:functions
```

API will run in: `http://localhost:5001/tive-challenge/us-central1/`

After API is running, to serve the Web Client, in a new terminal, run:

```bash
npm run serve:client
```

Web Client will run in: `http://localhost:4200/`

**Don't forget** that **service worker** will not work in development mode, so caching requests to the API won't be enabled.

## Run the App in Production Mode

You can find the latest production deployment in: <https://tive-challenge.web.app> (Web Client). The API can be accessed in `https://us-central1-tive-challenge.cloudfunctions.net/`. Deployment was made using **Firebase Hosting** and **Firebase Cloud Functions**.

Also, you can run a production environment in your local machine by running:

```bash
npm run build:prod
```

And serving the result (the bundle is generated under `dist/tive-challenge`) over a local web server. For example, you could use [http-server](https://www.npmjs.com/package/http-server) like this:

```bash
http-server dist/tive-challenge
```

This will run the application in production mode in `localhost:8080` by default.

Notice that the application is a SPA (Single Page Application), so refreshing under some route could go wrong because web server is not configured. You can improve this by running the app under a more sofisticate web server like [NGINX](https://hub.docker.com/_/nginx) in a docker container or in your local environment.

Also notice that the production build will communicat with the hosted API Cloud Functions. In order to change this, you have to change the `apiBasePath` under `src/environments/environment.prod.ts` to match the one under `src/environments/environment.ts`, after that you have to run the API in dev mode, re-build and serve the Web Client.

## Additional Notes

- App is using [CircleCI](https://circleci.com/gh/combimauri/tive-challenge) for CI/CD. You can find the **pipeline** under `.circleci/config.yml`.

# Angular Documentation

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running lint

Run `ng lint` to execute tslint.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
