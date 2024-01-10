# Phygital

This interface is developed by Jeffrey Arts for the creation of concrete scuptures. With this technology he creates geometric sculptures in a collaborative effort with [the algorithm](https://github.com/JeffreyArts/visual-pattern-generator). Sometimes the algorithm create something stunning in one go, but more often it needs a little bit of artistic editation. Using the work method the artist can iterively explore the beauty in 3-dimensional symmetry. Which he will materialise in concrete whenever he is satisfied with the created outcome. Making these digital 3D models operate as a 3-dimensional sketches that used during the fabrication proces.

If you want to get this project up and running for yourself, you'll need to be familair with the nodeJS environment and comfortable with the terminal. Assuming that you already have nodeJS running on your machine (if not, use [NVM](https://github.com/nvm-sh/nvm) to install it with a few steps) use the steps below to get this project up and running.

## Getting started

To get the project up and running, execute the following commands;

```
$ npm install
$ npm run dev

or

$ yarn install
$ yarn dev
```

To build the project for production, run the following command:
```
$ npm run build 

or 

$ yarn build
```
This will build the project, and output the files to the dist directory.


## Deployment
By default this application has a build-in feature to deploy the static generated website to a remote server. For this to work, you'll have to configure a `.env.staging` or `.env.production` file. Which is basically a copy of the `.env` or `.env.local` file, with the addition of the following 4 lines:

```
DEPLOYMENT_USER=<user>
DEPLOYMENT_HOST=<host>
DEPLOYMENT_PATH=/var/www/vite/<project>
MAX_BACKUPS=8
```
*DEPLOYMENT_USER* = The user that you'll use to login to the server
*DEPLOYMENT_HOST* = The hostname or ip address of the server 
*DEPLOYMENT_PATH* = The path of where you want to deploy the app to
*MAX_BACKUPS* = The amount of back-ups you want to keep

At the location of DEPLOYMENT_PATH the deployment script will create a `current` directory where the project is actually located. Whenever you'll do a future deployment, the current directory will be renamed to bk_<timecode> and the new version will be placed again at the current directory. The number that you specify at MAX_BACKUPS will determine how many old versions will be kept. Versions older than the number specified here will be removed automatically.

With the configuration of these 4 lines, you can now deploy the project with one of the following command. For more information about this deployment script, I'd like to refer you to [this page](https://github.com/JeffreyArts/server/wiki/Vite-website-setup). This page will go into more depth, and also provides you with a basis for how you could set-up the server environment on a remote (VPS) server.


```
$ npm run deploy 

or 

$ yarn deploy
```


## Fair Source License

Copyright © 2024 Jeffrey Arts

Licensor: Jeffrey Arts 

Software: Phygital

Use Limitation: 1 user

License Grant. Licensor hereby grants to each recipient of the Software (“you”) a non-exclusive, non-transferable, royalty-free and fully-paid-up license, under all of the Licensor’s copyright and patent rights, to use, copy, distribute, prepare derivative works of, publicly perform and display the Software,, as well as any digital or physical objects produced with the Software, subject to the Use Limitation and the conditions set forth below.

Use Limitation. The license granted above allows use by up to the number of users per entity set forth above (the “Use Limitation”). For determining the number of users, “you” includes all affiliates, meaning legal entities controlling, controlled by, or under common control with you. If you exceed the Use Limitation, your use is subject to payment of Licensor’s then-current list price for licenses.

Conditions. Redistribution in source code or other forms must include a copy of this license document to be provided in a reasonable manner. Any redistribution of the Software or its produced digital or physical objects is only allowed subject to this license.

Trademarks. This license does not grant you any right in the trademarks, service marks, brand names or logos of Licensor.

DISCLAIMER. THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OR CONDITION, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. LICENSORS HEREBY DISCLAIM ALL LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE.

Termination. If you violate the terms of this license, your rights will terminate automatically and will not be reinstated without the prior written consent of Licensor. Any such termination will not affect the right of others who may have received copies of the Software or its produced digital or physical objects from you.