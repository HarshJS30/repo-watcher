export async function fetchRepoStats(owner: string, name: string) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${name}`);

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} for ${owner}/${name}`);
  }

  const data = await response.json();

  return {
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    language: data.language,
  };
}
