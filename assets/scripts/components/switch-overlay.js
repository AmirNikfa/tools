const overlayEl = document.querySelector("#overlay-confirm-popup");
const overlaySwitchClass = "invisible";

const switchOverlay = (type) => {
	if(type === "open") {
		overlayEl.classList.remove(overlaySwitchClass);
	} else {
		overlayEl.classList.add(overlaySwitchClass);
	}
}

export { switchOverlay };