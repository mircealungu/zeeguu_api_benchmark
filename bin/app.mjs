import ZeeguuAPI from './ZeeguuAPI.js'

// To interact with the API we need to be logged in
// If this user does not exist, we'll create it
const EMAIL = 'testivus3@mir.lu'
const PASS = 'secret'
const USER_NAME = 'testivus3'

// The only argument of the ZeeguuAPI constructor is the API url
// without / at the end
const api = new ZeeguuAPI('http://159.89.13.31:8080')

// We either sign-in or create an account
// in both cases, we follow this with the doLoggedInStuff()

api.signIn(
  EMAIL,
  PASS,
  error => {
    api.addUser(EMAIL, PASS, 'test', USER_NAME, doLoggedInStuff)
  },
  session => {
    console.log('Got a session: ' + session)
    doLoggedInStuff()
  }
)

function doLoggedInStuff () {
  api.getUserDetails(data => {
    console.log(
      `user: ${data.name} (${data.email}, ` +
        `native: ${data.native_language}, ` +
        `learned: ${data.learned_language})`
    )
  })

  // we always need all the info to get a translation
  api
    .getPossibleTranslations(
      'da',
      'en',
      'stolthed',
      'stolthed og skepsis',
      'https://www.dr.dk/nyheder/udland/stolthed-og-skepsis-briter-kan-faa-coronavaccine-fra-naeste-uge'
    )
    .then(result => {
      result.text().then(t => {
        let j = JSON.parse(t)
        console.log(j)
        console.log(j.translations[0].translation)
      })
    })
}
