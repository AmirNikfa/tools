const hiderClass = "hide";
const showerClass = "show";

const confirmBoxSelector = ".confirm-popup-container";
const confirmBox = document.querySelector(confirmBoxSelector);

class ConfirmPopup {
	constructor(openButtons, closeButtons) {

		this.connectOpenButtons(openButtons);
		this.connectCloseButtons(closeButtons);
	}

	connectCloseButtons(closeButtons) {
		closeButtons.forEach(closeButton => {
			const btn = document.querySelector(closeButton);
			btn.addEventListener("click", () => {
				import("./switch-overlay.js").then(module => {
					module.switchOverlay("close");
				})
				confirmBox.classList.add(hiderClass);
				confirmBox.classList.remove(showerClass);
			})
		})
	}

	connectOpenButtons(openButtons) {
		openButtons.forEach(openButton => {
			const btn = document.querySelector(openButton.selector);
			btn.addEventListener("click", () => {
				import("./switch-overlay.js").then(module => {
					module.switchOverlay("open");
				})
				confirmBox.querySelector("p").textContent = openButton.message;
				confirmBox.classList.add(showerClass);
				confirmBox.classList.remove(hiderClass);
			})
		})
	}
}

export { ConfirmPopup };
