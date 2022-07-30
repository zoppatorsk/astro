<script>
	import { onMount } from 'svelte';
	import ChevronRightCircleOutline from 'svelte-material-icons/ChevronRightCircleOutline.svelte';
	import ChevronLeftCircleOutline from 'svelte-material-icons/ChevronLeftCircleOutline.svelte';
	import InformationOutline from 'svelte-material-icons/InformationOutline.svelte';

	import getHoroscope from './lib/services/horoscopeService';
	import getImage from './lib/services/imageService';
	const signs = [
		{ name: 'aquarius', dates: '20/1 - 18/2' },
		{ name: 'pisces', dates: '19/2 - 20/3' },
		{ name: 'aries', dates: '21/3 - 19/4' },
		{ name: 'taurus', dates: '20/4 - 20/5' },
		{ name: 'gemini', dates: '21/5 - 20/6' },
		{ name: 'cancer', dates: '21/6 - 22/7' },
		{ name: 'leo', dates: '23/7 - 22/8' },
		{ name: 'virgo', dates: '23/8 - 22/9' },
		{ name: 'libra', dates: '23/9 - 22/10' },
		{ name: 'scorpio', dates: '23/10 - 21/11' },
		{ name: 'sagittarius', dates: '22/11 - 22/12' },
		{ name: 'capricorn', dates: '22/12 - 19/1' },
	];
	let horoscope = {};
	let selectedSign;
	let imageUrls = {};
	imageUrls.landscape = './images/undefined.png';
	imageUrls.portrait = './images/undefined.png';
	let imageUrl = './images/undefined.png';

	let showOverlay = false;
	let day = 'today';
	let hideAttribution = true;
	let innerWidth = window.innerWidth;

	$: imageUrl = innerWidth >= 800 && imageUrls.landscape ? imageUrls.landscape : imageUrls.portrait;

	onMount(async () => {
		let sign = localStorage.getItem('selectedSign');
		if (!sign) showOverlay = true;
		selectedSign = sign;
	});

	async function getData(sign, selectedDay) {
		horoscope = await getHoroscope(sign, selectedDay);
		imageUrls = await getImage(horoscope.mood);
	}

	$: if (selectedSign && day) {
		getData(selectedSign, day);
		localStorage.setItem('selectedSign', selectedSign);
	}

	function prevDay() {
		if (day == 'yesterday') return;
		if (day == 'today') return (day = 'yesterday');
		if (day == 'tomorrow') return (day = 'today');
	}

	function nextDay() {
		if (day == 'tomorrow') return;
		if (day == 'today') return (day = 'tomorrow');
		if (day == 'yesterday') return (day = 'today');
	}
</script>

<svelte:window bind:innerWidth />
<main>
	<div class="overlay {showOverlay ? '' : 'hidden'}">
		<div id="close" on:click={() => (showOverlay = false)}>X</div>
		<h2>Select Sign</h2>
		<div class="signsContainer">
			{#each signs as sign}
				<div
					class="sign {selectedSign === sign.name ? 'outline' : ''}"
					on:click={() => {
						selectedSign = sign.name;
						showOverlay = false;
					}}
				>
					<img src="./images/{sign.name}.png" alt={sign.name} width="40px" height="40px" />
					<p>{sign.name}</p>
					<p>
						<small>{sign.dates}</small>
					</p>
				</div>
			{/each}
		</div>
	</div>

	<div class="container" style="background-image: url('{imageUrl}');">
		{#if selectedSign}
			<div class="content">
				<img src="./images/{selectedSign}.png" alt={selectedSign} height="100px" width="100px" />
				<h1>{selectedSign}</h1>
				<div class="day">
					<div on:click={prevDay} class="pointer">
						<ChevronLeftCircleOutline size="24px" color={day == 'yesterday' ? '#504c4c' : 'white'} />
					</div>
					<div class="date">{horoscope.current_date}</div>
					<div on:click={nextDay} class="pointer">
						<ChevronRightCircleOutline size="24px" color={day == 'tomorrow' ? '#504c4c' : 'white'} />
					</div>
				</div>
				<p>{horoscope.description}</p>
				<div class="traits">
					<div>
						<strong>Number</strong>
						<p>{horoscope.lucky_number}</p>
					</div>
					<div>
						<strong>Color</strong>
						<p>{horoscope.color}</p>
					</div>
					<div>
						<strong>Mood</strong>
						<p>{horoscope.mood}</p>
					</div>
				</div>
				<div class="hearts"><img src="./images/{selectedSign}.png" alt="" srcset="" width="34px" height="34px" />❤<img class="pointer" src="./images/{horoscope.compatibility}.png" alt="" srcset="" width="34px" height="34px" on:click={() => (selectedSign = horoscope.compatibility)} /></div>
				<div
					id="select"
					on:click={() => {
						showOverlay = true;
					}}
				>
					Change Sign
				</div>
			</div>
			<div id="attribution" on:click={() => (hideAttribution = !hideAttribution)}>
				<InformationOutline />
			</div>
			<div id="attribution-box" class:hidden={hideAttribution}>
				Attributions:
				<p>Background images from <a href="https://www.pexels.com/" target="_blank">Pexels</a></p>
				<a href="https://www.flaticon.com/packs/zodiac-9" title="zodiac icons" target="_blank">Zodiac icons created by Freepik - </a>
			</div>
		{/if}
	</div>
</main>

<style>
</style>
