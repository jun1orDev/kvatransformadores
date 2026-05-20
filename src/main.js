import './style.css';

document.addEventListener('DOMContentLoaded', () => {
	initMenu();
	initBanner();
	initAnimations();
	initNextSection();
	initSlide();
	initLightbox();
});

function isMobileDevice() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function initMenu() {
	const icon = document.querySelector('[data-menu]');
	const menuItems = document.querySelectorAll('.list-m a');

	if (!icon) {
		return;
	}

	icon.setAttribute('aria-expanded', 'false');
	icon.setAttribute('aria-label', 'Abrir menu principal');

	icon.addEventListener('click', openMenu);

	menuItems.forEach((item) => {
		item.addEventListener('click', openMenu);
	});
}

function openMenu() {
	const icon = document.querySelector('[data-menu]');
	const list = document.querySelector('.itens-menu');
	const menu = document.querySelector('.menu-responsivo');

	if (!list || !menu) {
		return;
	}

	list.classList.toggle('ativo');
	menu.classList.toggle('close');

	if (!list.classList.contains('ativo')) {
		list.classList.toggle('close');
	} else if (list.classList.contains('close')) {
		list.classList.remove('close');
	}

	if (isMobileDevice()) {
		window.navigator.vibrate?.(200);
	}

	if (icon) {
		const isOpen = list.classList.contains('ativo');
		icon.setAttribute('aria-expanded', String(isOpen));
		icon.setAttribute('aria-label', isOpen ? 'Fechar menu principal' : 'Abrir menu principal');
	}
}

function initBanner() {
	const banner = document.querySelector('[data-banner]');

	if (!banner) {
		return;
	}

	const timer = Number(banner.dataset.banner) || 6000;

	setInterval(() => {
		if (banner.classList.contains('b2')) {
			banner.classList.remove('b2');
			banner.classList.add('b3');
		} else if (banner.classList.contains('b3')) {
			banner.classList.remove('b3');
			banner.classList.add('b1');
		} else {
			banner.classList.remove('b1');
			banner.classList.add('b2');
		}
	}, timer);
}

function initAnimations() {
	const textos = document.querySelectorAll('[data-animation]');

	textos.forEach((texto) => {
		const timer = Number(texto.dataset.animation) || 0;

		setTimeout(() => {
			texto.classList.remove('no-anima-fade');
			texto.classList.add('anima-fade');
		}, timer);
	});
}

function initNextSection() {
	const banner = document.querySelector('.banner');
	const btnSection = document.querySelector('.next-section');

	if (!banner || !btnSection) {
		return;
	}

	const heightBanner = banner.offsetHeight;

	btnSection.addEventListener('click', (event) => {
		event.preventDefault();

		window.scrollTo({
			top: heightBanner,
			behavior: 'smooth',
		});
	});
}

function initSlide() {
	const slides = document.querySelectorAll('[data-slideItem]');
	const btnLeft = document.querySelector('[data-slide="left"]');
	const btnRight = document.querySelector('[data-slide="right"]');

	if (!slides.length || !btnLeft || !btnRight) {
		return;
	}

	let iterator = 0;

	function slideMove(typeBtn) {
		let animationClass;

		if (typeBtn === 'right') {
			iterator = iterator >= slides.length ? 1 : iterator + 1;
			animationClass = 'animationR';
		} else if (typeBtn === 'left') {
			iterator = iterator <= 1 ? slides.length : iterator - 1;
			animationClass = 'animationL';
		} else {
			iterator = 1;
			animationClass = '';
		}

		slides.forEach((item) => {
			if (item.dataset.slideitem === `${iterator}`) {
				item.style.display = 'flex';
				item.classList.add(animationClass || 'no-animate');
			} else {
				item.style.display = 'none';
				item.classList.remove('animationR', 'animationL', 'no-animate');
			}
		});

		if (isMobileDevice()) {
			window.navigator.vibrate?.(100);
		}
	}

	btnRight.addEventListener('click', slideMove.bind(null, btnRight.dataset.slide));
	btnLeft.addEventListener('click', slideMove.bind(null, btnLeft.dataset.slide));

	slideMove();
}

function initLightbox() {
	const servicos = document.querySelectorAll('[data-servico]');
	const modal = document.querySelector('.light-box');
	const close = document.querySelector('.close-modal');
	const imageI = modal?.querySelector('.image-produto img');

	if (!servicos.length || !modal || !close || !imageI) {
		return;
	}

	function getInfosProduto(id) {
		const servico = servicos[id - 1];

		if (!servico) {
			return;
		}

		const descricao = [];

		modal.classList.add('openModal');

		for (const item of servico.children[2].children) {
			descricao.push(item.innerText);
		}

		modal.querySelector('h3').innerHTML = servico.children[1].innerHTML;
		modal.querySelector('ul').innerHTML = '';

		descricao.forEach((texto) => {
			const newLi = document.createElement('li');
			newLi.innerHTML = texto;
			modal.querySelector('ul').append(newLi);
		});

		const imageSrc = imageI.src.split('/');
		imageSrc[imageSrc.length - 1] = `servico-${id}.jpg`;
		imageI.src = imageSrc.join('/');
	}

	servicos.forEach((servico) => {
		servico.addEventListener('click', getInfosProduto.bind(null, Number(servico.dataset.servico)));
	});

	close.addEventListener('click', () => {
		modal.classList.remove('openModal');
		modal.querySelector('ul').innerHTML = '';
	});
}
