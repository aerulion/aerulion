const ENDPOINT = 'https://api.github.com/graphql';

const gql = async (token, query, variables) => {
    const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `bearer ${token}`,
            'Content-Type': 'application/json',
            'User-Agent': 'aerulion-profile-cards'
        },
        body: JSON.stringify({query, variables})
    });

    if (!res.ok) throw new Error(`GitHub API ${res.status} ${res.statusText}: ${await res.text()}`);

    const payload = await res.json();
    if (payload.errors) throw new Error(`GitHub API: ${payload.errors.map((e) => e.message).join('; ')}`);
    return payload.data;
};

const PROFILE = `
query($login:String!,$cursor:String){
  user(login:$login){
    login name createdAt
    followers{totalCount}
    pullRequests{totalCount}
    issues{totalCount}
    repositoriesContributedTo(contributionTypes:[COMMIT,PULL_REQUEST,ISSUE,REPOSITORY]){totalCount}
    repositories(first:100,after:$cursor,ownerAffiliations:OWNER,orderBy:{field:STARGAZERS,direction:DESC}){
      totalCount
      pageInfo{hasNextPage endCursor}
      nodes{
        name isFork isPrivate isArchived stargazerCount
        primaryLanguage{name}
        languages(first:12,orderBy:{field:SIZE,direction:DESC}){edges{size node{name}}}
      }
    }
  }
}`;

const YEAR = `
query($login:String!,$from:DateTime!,$to:DateTime!){
  user(login:$login){
    contributionsCollection(from:$from,to:$to){
      totalCommitContributions
      restrictedContributionsCount
      contributionCalendar{
        totalContributions
        weeks{contributionDays{date contributionCount}}
      }
    }
  }
}`;

export const fetchProfile = async (token, login) => {
    const repos = [];
    let cursor = null;
    let head = null;

    do {
        const {user} = await gql(token, PROFILE, {login, cursor});
        head ??= user;
        repos.push(...user.repositories.nodes);
        cursor = user.repositories.pageInfo.hasNextPage ? user.repositories.pageInfo.endCursor : null;
    } while (cursor);

    const owned = repos.filter((r) => !r.isFork);

    return {
        login: head.login,
        name: head.name ?? head.login,
        createdAt: head.createdAt,
        followers: head.followers.totalCount,
        pullRequests: head.pullRequests.totalCount,
        issues: head.issues.totalCount,
        contributedTo: head.repositoriesContributedTo.totalCount,
        repoCount: owned.length,
        stars: owned.reduce((sum, r) => sum + r.stargazerCount, 0),
        repos: owned
    };
};

export const fetchContributions = async (token, login, createdAt) => {
    const start = new Date(createdAt);
    const now = new Date();
    const days = new Map();
    let commits = 0;
    let contributions = 0;

    for (let year = start.getUTCFullYear(); year <= now.getUTCFullYear(); year++) {
        const from = new Date(Date.UTC(year, 0, 1));
        const to = new Date(Date.UTC(year, 11, 31, 23, 59, 59));
        const {user} = await gql(token, YEAR, {
            login,
            from: (from < start ? start : from).toISOString(),
            to: (to > now ? now : to).toISOString()
        });

        const c = user.contributionsCollection;
        commits += c.totalCommitContributions + c.restrictedContributionsCount;
        contributions += c.contributionCalendar.totalContributions;
        for (const week of c.contributionCalendar.weeks) {
            for (const day of week.contributionDays) days.set(day.date, day.contributionCount);
        }
    }

    return {commits, contributions, days: [...days].sort(([a], [b]) => a.localeCompare(b))};
};

export const languageTotals = (repos, {exclude = []} = {}) => {
    const totals = new Map();
    for (const repo of repos) {
        for (const {size, node} of repo.languages.edges) {
            if (exclude.includes(node.name)) continue;
            totals.set(node.name, (totals.get(node.name) ?? 0) + size);
        }
    }
    const sorted = [...totals].sort((a, b) => b[1] - a[1]);
    const sum = sorted.reduce((s, [, v]) => s + v, 0) || 1;
    return sorted.map(([name, size]) => ({name, size, share: size / sum}));
};

export const streaks = (days) => {
    let longest = 0;
    let run = 0;

    for (const [, count] of days) {
        run = count > 0 ? run + 1 : 0;
        if (run > longest) longest = run;
    }

    const today = new Date().toISOString().slice(0, 10);
    let current = 0;
    for (let i = days.length - 1; i >= 0; i--) {
        const [date, count] = days[i];
        if (count === 0) {
            if (date === today) continue; // today is not over yet
            break;
        }
        current++;
    }

    return {current, longest};
};
