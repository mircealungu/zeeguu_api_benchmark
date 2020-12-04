import fetch from "cross-fetch";

const ZeeguuAPI = class {
  constructor(baseAPIurl) {
    this.baseAPIurl = baseAPIurl;
  }

  appendSessionToUrl(endpointName) {
    if (endpointName.includes("?")) {
      return `${this.baseAPIurl}/${endpointName}&session=${this.session}`;
    }
    return `${this.baseAPIurl}/${endpointName}?session=${this.session}`;
  }

  get(endpoint, session, callback) {
    fetch(this.appendSessionToUrl(endpoint, session))
      .then((response) => response.json())
      .then((data) => {
        callback(data);
      });
  }

  signIn(email, password, onError, onSuccess) {
    console.log("trying to sign in to: " + this.baseAPIurl);
    let url = this.baseAPIurl + `/session/${email}`;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `password=${password}`,
    })
      .then((response) => {
        // https://stackoverflow.com/a/45366905/1200070
        response.json().then((data) => {
          if (response.status === 200) {
            this.session = data;
            onSuccess(data);
            return;
          }
          onError(data.message);
        });
      })
      .catch((error) => {
        if (!error.response) {
          onError(
            "There seems to be a problem with the server. Please try again later."
          );
        }
      });
  }

  getUserDetails(callback) {
    this.get("get_user_details", this.session, callback);
  }

  addUser(email, password, invite_code, user_name, onSuccess) {
    let url = this.baseAPIurl + `/add_user/${email}`;
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `password=${password}&invite_code=${invite_code}&username=${user_name}`,
    }).then((response) => {
      response.text().then((session) => {
        console.log("GOT SESSION AFTER CREATING USER: " + session);
        this.session = session;
        onSuccess(session);
      });
    });
  }

  getPossibleTranslations(from_lang, to_lang, word, context, pageUrl) {
    console.log(this.session);
    let url = this.appendSessionToUrl(
      `get_possible_translations/${from_lang}/${to_lang}`
    );
    console.log(url);
    console.log(
      this.appendSessionToUrl(
        `get_possible_translations/${from_lang}/${to_lang}`
      )
    );
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `word=${word}&context=${context}&url=${pageUrl}`,
    });
  }
};

export default ZeeguuAPI;
