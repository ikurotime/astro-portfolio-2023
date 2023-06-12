const { API_KEY, GITHUB_API_KEY } = import.meta.env;

const fetchArticles = async ({ PER_PAGE = 3 }) => {
  return fetch(
    `https://dev.to/api/articles?username=ikurotime${
      PER_PAGE ? "&per_page=" + PER_PAGE : ""
    }`,
    {
      "api-key": API_KEY,
    }
  )
    .then((res) => res.json())
    .then((data) => data);
};
const options = {
  method: "GET",
  headers: {
    Authorization:
      "Bearer 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",
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  },
};
const fetchProjects = async ({ PER_PAGE = 3 }) => {
  console.log(GITHUB_API_KEY);
  return fetch(
    `https://api.github.com/user/repos?per_page=${PER_PAGE}&sort=pushed&affiliation=owner`,
    options
  )
    .then((response) => response.json())
    .then((response) => response);
};

export { fetchArticles, fetchProjects };
