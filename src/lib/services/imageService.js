import key from '../api.js';
const baseUrl = 'https://api.pexels.com/v1';
const apiKey = key();

async function getImage(mood) {
	//some moods wont return images, here do a rebind of it.
	if (mood.toLowerCase() === 'talkative') mood = 'talk';

	const query = `/search?query=${mood}&per_page=10`;
	let res = await fetch(`${baseUrl}${query}`, { method: 'GET', headers: { Authorization: apiKey } });
	let data = await res.json();
	let imageUrls = {};
	if (data.photos.length < 0) {
		//if still cant find any image just return a default image
		imageUrls.portrait = './images/undefined.png';
		imageUrls.landscape = './images/undefined.png';
	}
	const randomImageIndex = Math.floor(Math.random() * data.photos.length);
	// console.log('i', randomImageIndex);
	// console.log('photos', data.photos[randomImageIndex].src);
	imageUrls.portrait = data.photos[randomImageIndex].src.portrait;
	imageUrls.landscape = data.photos[randomImageIndex].src.landscape;

	return imageUrls;
}

export default getImage;
