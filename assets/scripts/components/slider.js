export class Slider {
	slides = [];

	constructor(
		slideSelector,
		bBtnSelector,
		fBtnSelector,
		btnDisabled,
		sliderLink
	) {
		this.currentSlide = 0;
		this.connect(
			slideSelector,
			bBtnSelector,
			fBtnSelector,
			btnDisabled,
			sliderLink
		);
	}

	updateSlideMap(index) {
		this.lastMapTarget.classList.remove(this.mapActiveClassName);
		this.lastMapTarget = this.navigationMaps[index];
		this.navigationMaps[index].classList.add(this.mapActiveClassName);
	}

	shiftSlideHandler(event, dir) {
		const maxSLidesIdx = this.slides.length - 1;

		if (dir === 0) {
			let target;
			if (event.target === event.currentTarget) {
				return;
			}

			for (let i = 0; i < this.navigationMaps.length; i++) {
				if (this.navigationMaps[i] === event.target) {
					target = i;
					break;
				}
			}
			this.currentSlide = target;
		} else if (dir === 1 && this.currentSlide < maxSLidesIdx) {
			this.currentSlide++;
		} else if (dir === -1 && this.currentSlide > 0) {
			this.currentSlide--;
		}

		this.slider.scrollTo({
			top: 0,
			left: this.slides[this.currentSlide].offsetLeft,
			behavior: "smooth",
		});

		this.updateSlideMap(this.currentSlide);

		switch (this.currentSlide) {
			case maxSLidesIdx:
				this.forwardBtn.classList.add(this.btnDisabled);
				this.backwardBtn.classList.remove(this.btnDisabled);
				break;
			case 0:
				this.backwardBtn.classList.add(this.btnDisabled);
				this.forwardBtn.classList.remove(this.btnDisabled);
				break;
			default:
				this.backwardBtn.classList.remove(this.btnDisabled);
				this.forwardBtn.classList.remove(this.btnDisabled);
		}
	}

	createSliderMap(hookSelector, map) {
		const hook = document.querySelector(hookSelector);

		this.mapActiveClassName = map.activeClassName;
		this.navigationMaps = [];

		const mapElement = document.createElement("div");
		mapElement.className = map.className;

		for (let i = 0; i < this.slides.length; i++) {
			this.navigationMaps.push(document.importNode(mapElement, true));
			hook.appendChild(this.navigationMaps[i]);
		}

		this.lastMapTarget = this.navigationMaps[0];
		this.lastMapTarget.classList.add(this.mapActiveClassName);

		hook.addEventListener("click", (event) => {
			this.shiftSlideHandler(event, 0);
		});
	}

	getDistance(startPoint = this.startPoint, endPoint = this.endPoint) {
		return startPoint - endPoint;
	}

	endHandler(event) {
		this.isDown = false;
		const offset = 50;
		const distance = this.getDistance();

		if (distance > offset) {
			this.shiftSlideHandler(event, 1);
		} else if (distance < 0 - offset) {
			this.shiftSlideHandler(event, -1);
		} else {
			this.shiftSlideHandler(event, null);
		}
	}

	moveHandler(event) {
		event.preventDefault();
		if (!this.isDown) {
			return;
		}

		const scrolled = this.scrollLeft;
		const distance = this.getDistance();

		if (event.pageX) {
			this.endPoint = event.pageX;
		} else {
			this.endPoint = event.touches[0].pageX;
		}

		this.slider.scrollTo(scrolled + distance, 0);
	}

	startHandler(event) {
		if (
			event.target !== this.forwardBtn &&
			event.target !== this.backwardBtn &&
			event.target.className !== this.navigationMaps[0].className &&
			!event.target.className.includes(this.sliderLinkClassName)
		) {
			event.preventDefault();
		}
		this.isDown = true;

		if (event.touches) {
			this.startPoint = event.touches[0].pageX;
			this.endPoint = event.touches[0].pageX;
			this.touch = event.touches[0];
		} else {
			this.startPoint = event.pageX;
			this.endPoint = event.pageX;
		}

		this.scrollLeft = event.currentTarget.scrollLeft;
	}

	makeDraggable(hook) {
		this.slider = document.querySelector(hook);
		const slider = this.slider;

		slider.addEventListener("mousedown", (event) => {
			this.startHandler(event);
		});
		slider.addEventListener("touchstart", (event) => {
			this.startHandler(event);
		});

		slider.addEventListener("mousemove", (event) => {
			this.moveHandler(event);
		});
		slider.addEventListener("touchmove", (event) => {
			this.moveHandler(event);
		});

		slider.addEventListener("mouseup", (event) => {
			this.endHandler(event);
		});
		slider.addEventListener("touchend", (event) => {
			this.endHandler(event);
		});

		slider.addEventListener("mouseleave", (event) => {
			event.preventDefault();
			if (!this.isDown) {
				return;
			}
			this.endHandler(event);
		});
		slider.addEventListener("touchcancel", (event) => {
			event.preventDefault();
			if (!this.isDown) {
				return;
			}
			this.endHandler(event);
		});
	}

	connect(slide, bBtn, fBtn, btnDis, sliderLink) {
		const slides = document.querySelectorAll(slide);
		for (const slide of slides) {
			this.slides.push(slide);
		}

		this.backwardBtn = document.querySelector(bBtn);
		this.forwardBtn = document.querySelector(fBtn);
		this.btnDisabled = btnDis;
		this.sliderLinkClassName = sliderLink;

		this.forwardBtn.addEventListener("click", (event) =>
			this.shiftSlideHandler(event, 1)
		);
		this.backwardBtn.addEventListener("click", (event) =>
			this.shiftSlideHandler(event, -1)
		);
	}
}
