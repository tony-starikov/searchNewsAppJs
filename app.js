function http() {
  return {
    get(url, callBackFunction) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);

        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            callBackFunction(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }

          const response = JSON.parse(xhr.responseText);

          callBackFunction(null, response);
        });

        xhr.addEventListener("error", () => {
          callBackFunction(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        callBackFunction(error);
      }
    },
    post(url, body, headers, callBackFunction) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);

        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            callBackFunction(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }

          const response = JSON.parse(xhr.responseText);

          callBackFunction(null, response);
        });

        xhr.addEventListener("error", () => {
          callBackFunction(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        callBackFunction(error);
      }
    },
  };
}

// init http module
const myHttp = http();
