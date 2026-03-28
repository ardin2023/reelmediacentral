export async function getTopWeekendBoxOffice() {
  const url = `${import.meta.env.BASE_URL}data/top-weekend-boxoffice.json`;
  console.log("FETCHING:", url);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status}`);
  }

  return res.json();
}
