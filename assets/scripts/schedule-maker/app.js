import { switchMenu } from "../components/hamburger-menu.js";
import { TableRowList as Scheduler } from "../components/schedule-maker.js";

class app {
	static init() {
		switchMenu(
			"#toggle-topmenu",
			"#overlay",
			".top-nav__list",
			"invisible"
		);

		const scheduler = new Scheduler(".schedule-maker");

		const dbRequest = indexedDB.open("tableStorage", 1);
		dbRequest.onsuccess = () => {
			scheduler.getCount().then((count) => {
				if (count > 0) {
					scheduler.updateTable();
				}
			});
		};

		dbRequest.onerror = () => {
			console.log("error opening database!");
		};
	}
}

app.init();
