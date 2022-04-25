const switchMenu = (btn, overlay, menu, togglerClass) => {
	const switchBtn = document.querySelector(btn);
	const overlayEl = document.querySelector(overlay);

	document.documentElement.addEventListener("click", (event) => {
		if (event.target === switchBtn && switchBtn.checked) {
			overlayEl.classList.remove(togglerClass);
			return;
		}

		if (!event.target.closest(menu)) {
			overlayEl.classList.add(togglerClass);
			switchBtn.checked = false;
		}
	});
};

export { switchMenu };
