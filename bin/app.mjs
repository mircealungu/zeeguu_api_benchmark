import ZeeguuAPI from "./ZeeguuAPI.js";

// To interact with the API we need to be logged in
// If this user does not exist, we'll create it
const EMAIL = "i@mir.lu";
const PASS = "pass";
const USER_NAME = "Mir";

// The only argument of the ZeeguuAPI constructor is the API url
// without / at the end
const api = new ZeeguuAPI("http://127.0.0.1:8080");
// const api = new ZeeguuAPI("http://168.119.137.59:8080");

// We either sign-in or create an account
// in both cases, we follow this with the doLoggedInStuff()

function logTime(funcname, before) {
  var after = new Date();
  console.log(`, ${funcname}, ${after - before}`);
}

api.signIn(
  EMAIL,
  PASS,
  (error) => {
    console.log("user not found");
    // console.log("creating new user...")
    // api.addUser(EMAIL, PASS, "test", USER_NAME, doLoggedInStuff);
  },
  (session) => {
    console.log("Logged in. Session: " + session);
    doLoggedInStuff();
  }
);

function doLoggedInStuff() {
  var before = new Date();
  api.getUserDetails((data) => {
    logTime("getUserDetails", before);
    // console.log(
    //   `user: ${data.name} (${data.email}, ` +
    //     `native: ${data.native_language}, ` +
    //     `learned: ${data.learned_language})`
    // )
  });

  // we always need all the info to get a translation
  var before = new Date();
  api
    .getPossibleTranslations(
      "da",
      "en",
      "stolthed",
      "stolthed og skepsis",
      "https://www.dr.dk/nyheder/udland/stolthed-og-skepsis-briter-kan-faa-coronavaccine-fra-naeste-uge"
    )
    .then((result) => {
      result.text().then((t) => {
        let j = JSON.parse(t);
        console.log(j);
        console.log(j.translations[0].translation);
        var translatorSource = j.translations[0].source.split(" ")[0];
        logTime("getPossibleTranslations--" + translatorSource, before);
      });
    });

  var before = new Date();
  api.getUserArticles((data) => {
    logTime("getUserArticles", before);
  });

  var before = new Date();
  api.getUserBookmarksToStudy((data) => {
    // console.log(data);
    logTime("getUserBookmarksToStudy", before);
  });
}
