const { API_KEY } = import.meta.env;

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
const fetchProjects = async ({ PER_PAGE = 3 }) => {
  return fetch(
    `https://api.github.com/users/ikurotime/repos?per_page=${PER_PAGE}&sort=pushed&affiliation=owner`
  )
    .then((response) => response.json())
    .then((response) => response);
};

export { fetchArticles, fetchProjects };
