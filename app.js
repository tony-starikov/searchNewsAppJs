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

// init news service
const newsService = (function () {
  const apiKey = "71722164e94d46b7925d3d996d9e16f2";
  const apiUrl = "https://newsapi.org/v2";

  return {
    topHeadlines(country = "ua", callBackFunction) {
      myHttp.get(
        `${apiUrl}/top-headlines?country=${country}&category=technology&apiKey=${apiKey}`,
        callBackFunction
      );
    },
    everything(query, callBackFunction) {
      myHttp.get(
        `${apiUrl}/everything?q=${query}&apiKey=${apiKey}`,
        callBackFunction
      );
    },
  };
})();

// UI Elements
const form = document.forms["searchForm"];
const countrySelect = form.elements["countrySelect"];
const newsSearch = form.elements["newsSearch"];
console.log(newsSearch);

// Event listeners
form.addEventListener("submit", (event) => {
  event.preventDefault();
  loadNews();
});

// Load new on start
function loadNews() {
  showLoader();

  const country = countrySelect.value;
  const searchText = newsSearch.value;

  if (!searchText) {
    newsService.topHeadlines(country, onGetResponse);
  } else {
    newsService.everything(searchText, onGetResponse);
  }
}

// Function on get response from server
function onGetResponse(error, response) {
  if (error) {
    const toastTemplateError = document.getElementById("liveToastError");
    const toastError = new bootstrap.Toast(toastTemplateError);
    toastError.show();
    return;
  }

  if (!response.articles.length) {
    const toastTemplateMessage = document.getElementById("liveToastMessage");
    const toastMessage = new bootstrap.Toast(toastTemplateMessage);
    toastMessage.show();
    return;
  }

  renderNews(response.articles);
  spinnerRemove();
}

// Function to render a news
function renderNews(news) {
  console.log(news);
  const newsContainer = document.querySelector(".news-container");
  newsContainer.innerHTML = "";

  let fragment = "";

  news.forEach((article) => {
    const template = articleTemplate(article);
    fragment += template;
  });

  newsContainer.insertAdjacentHTML("afterbegin", fragment);
}

// Function to create new template
function articleTemplate(article) {
  const template = `
          <div class="col-12 col-md-6 col-lg-4 mt-5">
            <div class="card h-100">
              <img src="${
                article.urlToImage || "https://placehold.co/600x400"
              }" class="card-img-top img-fluid" alt="...">
              <div class="card-body">
                <h5 class="card-title">${article.title || "Empty title"}</h5>
                <p class="card-text">
                  ${article.description || "Empty description"}
                </p>
              </div>
              <div class="card-footer">
                <a href="${
                  article.url
                }" target="_blank" class="btn btn-success">Read</a>
              </div>
            </div>
          </div>
  `;

  return template;
}

// Init events on content loaded
document.addEventListener("DOMContentLoaded", function () {
  loadNews();
});

// Show loader function
function showLoader() {
  const spinnerContainer = document.querySelector(".spinner-container");
  spinnerContainer.insertAdjacentHTML(
    "afterbegin",
    `
      <div class="spinner spinner-border mt-5" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
  `
  );
}

// Function to delete the spinner
function spinnerRemove() {
  const spinner = document.querySelector(".spinner");

  if (spinner) {
    spinner.remove();
  }
}
