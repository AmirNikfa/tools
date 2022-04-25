import { switchMenu } from "./components/hamburger-menu.js";
import { Slider } from "./components/slider.js";

class app {
	static init() {
		switchMenu(
			"#toggle-topmenu",
			"#overlay",
			".top-nav__list",
			"invisible"
		);

		const slider = new Slider(
			".slider__slide",
			"#back-btn",
			"#forward-btn",
			"btn-muted", 
			"slider__link"
		);

		slider.createSliderMap(".slider__maps", {
			className: "slider__map",
			activeClassName: "slider__map--active"
		});

		slider.makeDraggable(".slider");


	}
}

app.init();
