const baseUrl = 'https://aztro.sameerkumar.website/';

async function getHoroscope(sign, day) {
	const query = `?sign=${sign}&day=${day}`;
	let res = await fetch(`${baseUrl}${query}`, { method: 'POST' });
	let data = await res.json();
	data.compatibility = data.compatibility.toLowerCase();
	return data;
}
export default getHoroscope;
