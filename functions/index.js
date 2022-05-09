const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.addUser = functions.https.onCall(async (data, context) => {
  const { email, displayName } = data;
  // expects object with accountId and userId and email
  function randomPassword(length) {
    const chars =
      "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
    let password = "";
    for (let x = 0; x < length; x++) {
      const i = Math.floor(Math.random() * chars.length);
      password += chars.charAt(i);
    }
    return password;
  }

  const password = randomPassword(12);

  try {
    const existingUser = await admin
      .firestore()
      .collection("users")
      .where("email", "==", email)
      .get();
    if (existingUser.empty) {
      const res = await admin.auth().createUser({
        email,
        password,
        displayName,
      });
      console.log("res = ", res);
      await admin.firestore().collection("users").doc(res.uid).set(data);
      return res;
    } else {
      existingUser.forEach(async (doc) => {
        if (doc.data().disabled) {
          admin.auth().updateUser(doc.id, { disabled: false, displayName });
          admin
            .firestore()
            .collection("users")
            .doc(doc.id)
            .set({ disabled: false, displayName }, { merge: true });
        } else {
          return new Error("User Already exists");
        }
      });
      return { errorInfo: null };
    }
  } catch (err) {
    console.log("error =", err.code);
    return err;
  }
});

exports.removeUser = functions.https.onCall(async (data, context) => {
  const { uid, profile } = data;
  // expects object with accountId and userId and email

  try {
    const assignedContacts = await admin
      .firestore()
      .collection("contacts")
      .where("assignee", "==", uid)
      .get();
    assignedContacts.forEach((doc) => {
      admin
        .firestore()
        .collection("contacts")
        .doc(doc.id)
        .set({ assignee: "" }, { merge: true });
    });

    const res = await admin.auth().updateUser(uid, profile);

    await admin
      .firestore()
      .collection("users")
      .doc(uid)
      .set(profile, { merge: true });
    return res;
  } catch (err) {
    return err;
  }
});
