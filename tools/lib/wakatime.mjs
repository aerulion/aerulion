// Public all-time stats. No key needed while the profile shares its usage.
const endpoint = (id) => `https://wakatime.com/api/v1/users/${id}/stats`;

const seconds = (entry) =>
    Number(entry.total_seconds ?? 0) ||
    Number(entry.manual_coding_seconds ?? 0) + Number(entry.ai_coding_seconds ?? 0);

const take = (list, n) =>
    (list ?? []).slice(0, n).map((e) => ({name: e.name, percent: e.percent, hours: seconds(e) / 3600}));

export const fetchWakatime = async (id) => {
    const res = await fetch(endpoint(id), {headers: {'User-Agent': 'aerulion-profile-cards'}});
    if (!res.ok) throw new Error(`WakaTime ${res.status}: ${(await res.text()).slice(0, 120)}`);

    const {data} = await res.json();
    if (!data?.editors?.length) throw new Error('WakaTime returned no editor usage -- is the profile public?');

    return {
        range: data.human_readable_range ?? 'all time',
        hours: (data.editors ?? []).reduce((sum, e) => sum + seconds(e), 0) / 3600,
        languages: take(data.languages, 4),
        editors: take(data.editors, 3),
        categories: take(data.categories, 4)
    };
};
