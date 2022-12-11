function addElement(token) {
  document.getElementById("token").value = token.replaceAll('"', "");
  document.getElementById("email").value = "krismarrier@gmail.com"; //default for test
}

function addName(name) {
  const para = document.createElement("p");
  const node = document.createTextNode("First Name of The Contact: " + name);
  para.appendChild(node);
  const element = document.getElementById("div1");
  element.appendChild(para);
}

async function fetchToken() {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  await fetch("http://localhost:8080/credential", requestOptions)
    .then((response) => response.text())
    .then((cred) => {
      cred_process = JSON.parse(cred);
      if (cred_process.token != undefined) {
        addElement(cred_process.token);
      }
    })
    .catch((error) => {
      console.log("error", error);
      return null;
    });
}

async function fetchName() {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  await fetch("http://localhost:8080/name", requestOptions)
    .then((response) => response.text())
    .then((name) => {
      console.log(name);
      if (name != undefined) {
        addName(name);
      }
    })
    .catch((error) => {
      console.log("error", error);
      return null;
    });
}

fetchToken();
fetchName();
