function addElement(cred_process) {
  document.getElementById("id").value = cred_process.id;
  document.getElementById("secret").value = cred_process.secret;
  const para = document.createElement("p");
  const node = document.createTextNode(
    "Token: " + cred_process.token.replaceAll('"', "")
  );

  const link = document.createElement("a");
  const button = document.createElement("button");
  link.href = "/search.html";
  button.textContent = "To search";
  link.appendChild(button);

  para.appendChild(node);
  const element = document.getElementById("div1");
  element.appendChild(para);
  element.appendChild(link);
}

async function fetchCredential() {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  await fetch("http://localhost:8080/credential", requestOptions)
    .then((response) => response.text())
    .then((cred) => {
      cred_process = JSON.parse(cred);
      // if the user information exist
      // filling these information in form auto..
      if (cred_process.id != undefined) {
        addElement(cred_process);
      }
    })
    .catch((error) => {
      console.log("error", error);
      return null;
    });
}

fetchCredential();
