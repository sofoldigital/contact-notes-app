# Contact Notes (contact-notes-app)

An app to manage customer contact notes and actions

## Pre-requisites

The following tools are required to build the app and deploy the app to firebase

- Code Editor (if you don't already have one - VS Code is most popular which I also use): https://code.visualstudio.com/
- Node JS (used for building / compiling the app and installing various app dependencies): https://nodejs.org/en/

Optional:

- Git (this is standard software used for maintaining / versioning code): https://git-scm.com/

## Setting up a firebase account and project

1. Create an account at: https://firebase.google.com/ then "Go to console"
2. Once logged in you should see a list of projects. Select "Add Project"
3. Give your project a name your app address will ultimately be https://your-project-name.web.app
4. You will not require google analytics.

## Configure your user accounts for authentication

1. Click "Authentication" from the left nav bar and click "Get Started"
2. Select "Email/Password" and click "Enable" and then click Save (you don't need email link).
3. Click "Authentication again, and then "Add user" and add as many users as needed.
4. Copy the "User UID" for each user (and note down the name of person each UID belongs to) you will this when setting up the Database.

## Configure your user accounts in the database

1. Click "Firestore Database" from the left nav bar and click "Create Database"
2. With "Start in production mode" click next.
3. Select region closest to your users e.g. 'australia-southeast1' then click "Enable"
4. Click "Start Collection" for collection id type "users"
5. It will ask you to create a document this will be your users profile documents which we will create from the UID and names you record in step 4 of authentication setup.

When creating the profile documents:

- Document ID should be the UID for the user
- Field should be "displayName"
- Value should be the name of the user who the UID belongs to

6. Click Save
7. If you have more users make sure you have the "Users" collection selected and click "Add Document".

## Configure firestore security rules

1. Click on "Firestore" and then "Rules" to configure your backend security rules.
2. Replace the code with the following code:

```bash
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /interactions/{interactionId} {
      allow read, create, update: if request.auth != null
      allow delete: if request.auth.token.email == 'nicktest@test.com'
    }
    match /contacts/{contactId} {
      allow read, create, update: if request.auth != null
      allow delete: if request.auth.token.email == 'nicktest@test.com' || 'stevetest@test.com'
    }
    match /users/{userId} {
      allow read: if request.auth != null
    }
  }
}

```

3. Click "Publish"

This ensures only users who have been authenticated through firebase auth are able to read and write to the database.

## Download the repository

With git:

```bash
git clone https://github.com/sofoldigital/contact-notes-app.git
```

Without git:
Click "Code" dropdown and download zip then extract it to your computed

## Install dependencies

Change directory to the project folder and install dependencies using npm

```bash
cd contact-notes-app
npm install
```

## Configure your firebase web app

1. It will say "Get started by adding a firebase app" select the 3rd button (web)
2. Give your app a name again and select "Also set up firebase hosting" then select register app.
3. Copy the firebase config object (starting from and ending after the curly brackets).

e.g.

```
{
  apiKey: "AIzaSyD6Ys2eqoXhDslhv8cPhMMCjJ2iRMnRjLU",
  authDomain: "contact-notes-e0d03.firebaseapp.com",
  projectId: "contact-notes-e0d03",
  storageBucket: "contact-notes-e0d03.appspot.com",
  messagingSenderId: "453942763492",
  appId: "1:453942763492:web:eb2619af3252ca9840b1f1"
}
```

4. Open contact-notes-app/quasar.conf.js and search for "firebaseConfig". Paste the config object in place of the curly brackets. Once you have pasted the config, click next.
5. Install firebase CLI using the command provided
6. Type "firebase login" in your terminal and login to your firebase account.
7. Once logged in type "firebase init" to initialise firebase. Select existing project and Firestore and Hosting: configure files features.
8. Keep pressing enter until it asks "What do you want to use as your public directory?" type "dist/spa"
9. Keep pressing enter until it completes the firebase initialisation.
10. Do not deploy the app yet you will need to build the app first.

## Build the app for production

```bash
quasar build
```

## Deploy the app to firebase hosting

```bash
firebase deploy
```
