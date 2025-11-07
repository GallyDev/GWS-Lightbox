// GWS-Lightbox
const lightboxElements = document.querySelectorAll('[gws-lightbox]');
if(lightboxElements.length > 0){
	const lightbox = document.createElement('div');
	lightbox.id = 'gws-lightbox';

	const lightboxContent = document.createElement('div');
	lightboxContent.classList.add('lightbox-content');
	lightbox.appendChild(lightboxContent);


	lightbox.addEventListener('click', e => {
		if (e.target.tagName == "IMG") return;
		if (e.target.classList.contains('lightbox-arrow')) return;
		lightbox.classList.remove('open');
	});
	document.body.appendChild(lightbox);



	lightboxElements.forEach(gallery => {
		const images = gallery.querySelectorAll('img:not([gws-lightbox-hide])');
		gallery.options = gallery.getAttribute('gws-lightbox').split(' ');

		let lb_pagination;
		if(gallery.options.includes('paginated')){
			lb_pagination = document.createElement('div');
			lb_pagination.classList.add('lightbox-pagination');
			lightbox.appendChild(lb_pagination);
		}

		let lb_arrows = {};
		if(gallery.options.includes('arrows')){
			lb_arrows.prev = document.createElement('div');
			lb_arrows.prev.classList.add('lightbox-arrow', 'prev');
			lb_arrows.next = document.createElement('div');
			lb_arrows.next.classList.add('lightbox-arrow', 'next');
			lightbox.appendChild(lb_arrows.prev);
			lightbox.appendChild(lb_arrows.next);

			lb_arrows.prev.addEventListener('click', () => {
				const visibleFigures = Array.from(lightboxContent.querySelectorAll('figure')).filter(figure => {
					const rect = figure.getBoundingClientRect();
					return rect.left >= 0 && rect.right <= window.innerWidth;
				});
				if(visibleFigures.length > 0){
					const firstVisible = visibleFigures[0];
					const prevFigure = firstVisible.previousElementSibling;
					if(prevFigure){
						prevFigure.scrollIntoView({behavior: "smooth", block: "center"});
					}
				}
			});
			lb_arrows.next.addEventListener('click', () => {
				const visibleFigures = Array.from(lightboxContent.querySelectorAll('figure')).filter(figure => {
					const rect = figure.getBoundingClientRect();
					return rect.left >= 0 && rect.right <= window.innerWidth;
				});
				if(visibleFigures.length > 0){
					const lastVisible = visibleFigures[visibleFigures.length - 1];
					const nextFigure = lastVisible.nextElementSibling;
					if(nextFigure){
						nextFigure.scrollIntoView({behavior: "smooth", block: "center"});
					}
				}
			});
		}

		images.forEach(img => {
			const lb_stage_figure = document.createElement('figure');
			const lb_stage_img = document.createElement('img');
			lb_stage_img.src = img.src;
			lb_stage_img.alt = img.alt;
			lb_stage_figure.appendChild(lb_stage_img);
			lightboxContent.appendChild(lb_stage_figure);

			img.lb_stage_figure = lb_stage_figure;

			if(gallery.options.includes('paginated')){
				const lb_page_img = document.createElement('img');
				lb_page_img.src = img.src;
				lb_page_img.lb_stage_figure = lb_stage_figure;
				lb_pagination.appendChild(lb_page_img);

				lb_page_img.addEventListener('click', () => {
					lb_page_img.lb_stage_figure.scrollIntoView({behavior: "auto", block: "center"});
					lb_page_img.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
				});
			}



			img.addEventListener('click', () => {
				lightbox.classList.add('open');
				img.lb_stage_figure.scrollIntoView({behavior: "instant", block: "center"});

			});

		});
	});
}
