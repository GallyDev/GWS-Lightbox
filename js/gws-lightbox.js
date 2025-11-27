// GWS-Lightbox

const lightboxElements = document.querySelectorAll('[gws-lightbox],.gws-lightbox');
if(lightboxElements.length > 0){

	lightboxElements.forEach(gallery => {

		const lightbox = document.createElement('div');
		lightbox.id = 'gws-lightbox';

		const lightboxContent = document.createElement('div');
		lightboxContent.classList.add('lightbox-content');
		lightbox.appendChild(lightboxContent);			


		lightbox.addEventListener('click', e => {
			if (e.target.tagName == "IMG") return;
			if (e.target.tagName == "VIDEO") return;
			if (e.target.classList.contains('lightbox-arrow')) return;
			if(lightbox.classList.contains('zoom')){
				lightbox.classList.remove('zoom');
				return;
			}
			lightboxContent.querySelectorAll('video').forEach(video => video.pause());
			lightbox.classList.remove('open');
		});
		document.body.appendChild(lightbox);

		const links = gallery.querySelectorAll('a:has(:is(img,video):not([gws-lightbox-hide]))');
		links.forEach(link => {
			// remove all attributes
			while (link.attributes.length > 0) {
				link.removeAttribute(link.attributes[0].name);
			}
		});

		const images = gallery.querySelectorAll(':is(img,video):not([gws-lightbox-hide])');
		gallery.options = [...gallery.getAttribute('gws-lightbox')?.split(' ') || [], ...gallery.classList];

		let lb_pagination;
		let lb_pagination_last = null;
		if(gallery.options.includes('paginated')){
			lb_pagination = document.createElement('div');
			lb_pagination.classList.add('lightbox-pagination');
			lightbox.appendChild(lb_pagination);

			lightboxContent.addEventListener('scroll', e => {
				const visibleFigures = Array.from(lightboxContent.querySelectorAll('figure')).filter(figure => {
					const rect = figure.getBoundingClientRect();
					return rect.left >= 0 && rect.right <= window.innerWidth;
				});
				if(visibleFigures.length > 0 && lb_pagination_last != visibleFigures[0]){
					if(lb_pagination_last.querySelector('video')) lb_pagination_last.querySelector('video').pause();
					lb_pagination_last = visibleFigures[0];
					if(lb_pagination_last.querySelector('video')) lb_pagination_last.querySelector('video').play();
					visibleFigures[0].lb_page_img.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });

					lightbox.querySelectorAll(".gws-active").forEach(activeImg => activeImg.classList.remove("gws-active"));
					visibleFigures[0].lb_page_img.classList.add("gws-active");
				}
			});
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
				if(lightbox.classList.contains('zoom')) return;
				const visibleFigures = Array.from(lightboxContent.querySelectorAll('figure')).filter(figure => {
					const rect = figure.getBoundingClientRect();
					return rect.left >= 0 && rect.right <= window.innerWidth;
				});
				if(visibleFigures.length > 0){
					const firstVisible = visibleFigures[0];
					const prevFigure = firstVisible.previousElementSibling;
					if(prevFigure){
						prevFigure.scrollIntoView({behavior: "smooth", block: "center"});
						lb_pagination_last = prevFigure;
					}
				}

			});
			lb_arrows.next.addEventListener('click', () => {
				if(lightbox.classList.contains('zoom')) return;
				const visibleFigures = Array.from(lightboxContent.querySelectorAll('figure')).filter(figure => {
					const rect = figure.getBoundingClientRect();
					return rect.left >= 0 && rect.right <= window.innerWidth;
				});
				if(visibleFigures.length > 0){
					const lastVisible = visibleFigures[visibleFigures.length - 1];
					const nextFigure = lastVisible.nextElementSibling;
					if(nextFigure){
						nextFigure.scrollIntoView({behavior: "smooth", block: "center"});
						lb_pagination_last = nextFigure;
					}
				}
			});
		}

		images.forEach(img => {
			if(!img.src && img.tagName != "VIDEO") return;

			const lb_stage_figure = document.createElement('figure');
			let lb_stage_img;
			if(img.tagName == "VIDEO"){
				lb_stage_img = document.createElement('video');
				if(img.querySelector('source'))
					lb_stage_img.src = img.querySelector('source').src;
				else
					lb_stage_img.src = img.src;
				lb_stage_img.alt = img.alt || '';
				lb_stage_img.controls = true;
			} else {
				lb_stage_img = document.createElement('img');
				lb_stage_img.src = img.src;
				lb_stage_img.alt = img.alt;
			}
			lb_stage_figure.appendChild(lb_stage_img);
			lightboxContent.appendChild(lb_stage_figure);

			img.lb_stage_figure = lb_stage_figure;


			lb_stage_img.addEventListener('click', () => {
				
				if (lb_stage_img.tagName !== "VIDEO") lightbox.classList.toggle('zoom');

				if(lb_pagination_last){
					lb_pagination_last.scrollIntoView({ behavior: "instant", block: "center", inline: "center" });
					const lb_fml_int = setInterval(() => {
						lb_pagination_last.scrollIntoView({ behavior: "instant", block: "nearest", inline: "center" });
					}, 10);
					setTimeout(() => {
						clearInterval(lb_fml_int);
					}, 500);
				}
			});

			if(gallery.options.includes('paginated')){
				let lb_page_img;
				if(img.tagName == "VIDEO"){
					lb_page_img = document.createElement('video');
					if(img.querySelector('source'))
						lb_page_img.src = img.querySelector('source').src;
					else
						lb_page_img.src = img.src;
					lb_page_img.lb_stage_figure = lb_stage_figure;
					lb_stage_figure.lb_page_img = lb_page_img;
					// mute and play inline
					lb_page_img.muted = true;
					lb_page_img.autoplay = true;
					lb_page_img.playsInline = true;
					lb_page_img.loop = true;
					lb_pagination.appendChild(lb_page_img);
				} else {
					lb_page_img = document.createElement('img');
					lb_page_img.src = img.src;
					lb_page_img.lb_stage_figure = lb_stage_figure;
					lb_stage_figure.lb_page_img = lb_page_img;
				}
				lb_pagination.appendChild(lb_page_img);


				if(lightbox.querySelectorAll(".gws-active").length == 0) lb_page_img.classList.add("gws-active");

				lb_page_img.addEventListener('click', () => {
					if (lb_page_img.tagName == "VIDEO") lb_stage_img.play();
					if(lb_pagination_last && lb_pagination_last.querySelector('video')) lb_pagination_last.querySelector('video').pause();

					lb_pagination_last = lb_page_img.lb_stage_figure;
					lb_page_img.lb_stage_figure.scrollIntoView({behavior: "instant", block: "center"});
					lb_page_img.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });

					lightbox.querySelectorAll(".gws-active").forEach(activeImg => activeImg.classList.remove("gws-active"));
					lb_page_img.classList.add("gws-active");

				});
			}



			img.addEventListener('click', () => {
				lightbox.classList.add('open');
				if (img.tagName == "VIDEO") lb_stage_img.play();
				img.lb_stage_figure.scrollIntoView({behavior: "instant", block: "center"});

			});

		});
	});
}
