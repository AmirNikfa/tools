import { ConfirmPopup } from "./confirm-popup.js";

// keyword + identifier = ex: schedule-maker__remover
// identifiers
const keyword = ".schedule-maker";
const row = "__row";
const rowTemplate = "__row-template";
const remover = "__remover";
const adder = "__adder";
const input = "__input";
const inputList = "__inputs";
const inputTemplate = "__input-template";
const addRow = "__add-row";
const removeRow = "__remove-row";
const updateTable = "__update-table";
const resetTable = "__reset-table";
const saveTable = "__save-table";
const confirmBtn = "#yes";

const weeklyTableClassName = ".weekly-table";
const trCLassName = "weekly-table__tr";
const thClassName = "weekly-table__th";
const tdClassName = "weekly-table__td";
const savedTableClassName = "weekly-table-save-styles";
const tableHref = "../assets/css/styles.css";

let database;

const dbRequest = indexedDB.open("tableStorage", 1);
dbRequest.onsuccess = (event) => {
	database = event.target.result;
};

dbRequest.onupgradeneeded = (event) => {
	database = event.target.result;
	database.createObjectStore("tableDatas", { keyPath: "row" });
};

dbRequest.onerror = () => {
	console.log("error opening database!");
};

class TableRow {
	constructor(rowEl, keyword, updateInputListsHandler) {
		this.rowEl = rowEl;
		this.updateInputListsHandler = updateInputListsHandler;


		this.connectAddBtn(keyword);
		this.connectRemoveBtn(keyword);
	}

	connectRemoveBtn(keyword) {
		const removeBtn = this.rowEl.querySelector(`${keyword}${remover}`);
		removeBtn.addEventListener("click", () => {
			const inputs = this.rowEl.querySelectorAll(`${keyword}${input}`);
			if (inputs.length === 1) {
				alert("You Can't Delete Last Table Data!");
				return;
			}

			this.updateInputListsHandler("remove");
		});
	}

	connectAddBtn(keyword) {
		const addBtn =
			this.rowEl.querySelector(`${keyword}${adder}`) ||
			this.rowEl.querySelector(`${keyword}${adder}`);
		addBtn.addEventListener("click", () => {
			this.updateInputListsHandler("add");
		});
	}
}

export class TableRowList {
	tdRows = [];

	constructor() {
		const rows = document.querySelectorAll(`${keyword}${row}`);
		this.thRow = new TableRow(
			rows[0],
			`${keyword}`,
			this.updateInputLists.bind(this)
		);
		for (let i = 1; i < rows.length; i++) {
			this.tdRows.push(
				new TableRow(
					rows[i],
					`${keyword}`,
					this.updateInputLists.bind(this)
				)
			);
		}

		this.createConfirmationPopup();
		this.connectAddRowBtn();
		this.connectRemoveRowBtn();
		this.connectUpdateBtn();
		this.connectResetBtn();
		this.connectSaveBtn();
	}

	createConfirmationPopup() {
		new ConfirmPopup(
			[
				{
					message: "Are You Sure? All the Previous Data Will Get Deleted!",
					selector: ".schedule-maker__update-table",
				},
				{
					message: "Are You Sure?",
					selector: ".schedule-maker__reset-table",
				},
			],
			[".confirm-popup__close", "#yes", "#no"]
		);
	}

	updateInputLists(type) {
		const rows = this.tdRows.concat(this.thRow);

		rows.forEach((row) => {
			const tableRow = row.rowEl;
			const tableInputs = row.rowEl.querySelector(
				`${keyword}${inputList}`
			);

			switch (type) {
				case "add":
					const rowEl = document.importNode(
						document.querySelector(`${keyword}${inputTemplate}`)
							.content,
						true
					);
					const columnsLen =
						tableRow.querySelectorAll("input").length;
					rowEl.querySelector("input").placeholder = `Column ${
						columnsLen + 1
					}`;
					tableInputs.appendChild(rowEl);
					break;
				default:
					tableInputs.removeChild(tableInputs.lastElementChild);
			}
		});
	}

	connectAddRowBtn() {
		const addRowBtn = document.querySelector(`${keyword}${addRow}`);

		addRowBtn.addEventListener("click", () => {
			const rowLen = this.tdRows.length;

			const newRowTemplate = document.querySelector(
				`${keyword}${rowTemplate}`
			).content;
			const newRowElement = document.importNode(
				newRowTemplate.querySelector(`${keyword}${row}`),
				true
			);
			const newRowElementInputs = newRowElement.querySelector(
				`${keyword}${inputList}`
			);

			const inputTemplateEl = document.querySelector(
				`${keyword}${inputTemplate}`
			).content;
			const numberOfInputs = this.tdRows[0].rowEl.querySelectorAll(
				`${keyword}${input}`
			).length;

			for (let i = 0; i < numberOfInputs; i++) {
				const inputElement = document.importNode(
					inputTemplateEl.querySelector(`${keyword}${input}`),
					true
				);
				inputElement.placeholder = `Column ${i + 1}`;
				newRowElementInputs.appendChild(inputElement);
			}

			newRowElement.querySelector("h2").textContent = `Row ${rowLen + 2}`;
			this.tdRows.push(
				new TableRow(
					newRowElement,
					`${keyword}`,
					this.updateInputLists.bind(this)
				)
			);

			const scheduleSection = document.querySelector(`${keyword}`);
			scheduleSection.insertBefore(
				newRowElement,
				scheduleSection.lastElementChild.previousElementSibling
			);
		});
	}

	connectRemoveRowBtn() {
		const removeRowBtn = document.querySelector(`${keyword}${removeRow}`);
		removeRowBtn.addEventListener("click", () => {
			if (this.tdRows.length <= 1) {
				alert("You Can't Remove More!");
				return;
			}

			const scheduleSection = document.querySelector(`${keyword}`);
			const scheduleRows = document.querySelectorAll(`${keyword}${row}`);
			const lastRow = scheduleRows[scheduleRows.length - 1];

			scheduleSection.removeChild(lastRow);
			this.tdRows.pop();
			const tableStore = database
				.transaction("tableDatas", "readwrite")
				.objectStore("tableDatas");
			console.log(`row ${scheduleRows.length}`);

			tableStore.delete(scheduleRows.length);
		});
	}

	getRow(key) {
		const promise = new Promise((resolve) => {
			const tableStore = database
				.transaction("tableDatas", "readwrite")
				.objectStore("tableDatas");

			const dataRequest = tableStore.get(key);
			dataRequest.onsuccess = () => {
				resolve(dataRequest.result);
			};
		});

		return promise;
	}

	getCount() {
		const promise = new Promise((resolve) => {
			const tableStore = database
				.transaction("tableDatas", "readwrite")
				.objectStore("tableDatas");

			const countRequest = tableStore.count();
			countRequest.onsuccess = () => {
				resolve(countRequest.result);
			};
		});

		return promise;
	}

	updateTableData(rows, elementName, start = 0, end = rows.length) {
		const thead = document.querySelector(`${weeklyTableClassName} thead`);
		const tbody = document.querySelector(`${weeklyTableClassName} tbody`);

		for (let i = start; i < end; i++) {
			const tr = document.createElement("tr");
			tr.className = trCLassName;

			for (const column in rows[i]) {
				const dataElement = document.createElement(elementName);
				dataElement.className =
					elementName === "td" ? tdClassName : thClassName;
				dataElement.textContent = rows[i][column];

				tr.appendChild(dataElement);
			}

			if (elementName === "td") {
				tbody.appendChild(tr);
			} else {
				thead.appendChild(tr);
			}
		}
	}

	updateTable() {
		this.getCount()
			.then((count) => {
				const thead = document.querySelector(
					`${weeklyTableClassName} thead`
				);
				const tbody = document.querySelector(
					`${weeklyTableClassName} tbody`
				);
				if (count < 1) {
					// reset table to it's original, no data is getting added
					thead.innerHTML = `
					<tr class="${trCLassName}">
						<th class="${thClassName}"></th>
					</tr>
				`;
					tbody.innerHTML = `
					<tr class="${trCLassName}">
						<td class="${tdClassName}"></td>
					</tr>
				`;
					throw "Database is empty now!";
				} else {
					// clear table to add data
					thead.textContent = "";
					tbody.textContent = "";
				}

				const tableRows = [];
				for (let i = 1; i <= count; i++) {
					tableRows.push(this.getRow(i));
				}

				return Promise.all(tableRows);
			})
			.then((rowsDatas) => {
				for (let i = 0; i < rowsDatas.length; i++) {
					Object.defineProperty(rowsDatas[i], "row", {
						enumerable: false,
					});
				}

				this.updateTableData(rowsDatas, "th", 0, 1);
				this.updateTableData(rowsDatas, "td", 1);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	updateStorage() {
		if (!database) {
			return;
		}

		const tableStore = database
			.transaction("tableDatas", "readwrite")
			.objectStore("tableDatas");

		const thColumns = this.thRow.rowEl.querySelectorAll(
			`${keyword}${input}`
		);

		const firstRowDatas = {
			row: 1,
		};
		for (let i = 0; i < thColumns.length; i++) {
			firstRowDatas[`Column ${i + 1}`] = thColumns[i].value;
		}

		tableStore.put(firstRowDatas);

		for (let i = 0; i < this.tdRows.length; i++) {
			const rowDatas = {
				row: i + 2,
			};

			const rowInputs = this.tdRows[i].rowEl.querySelectorAll(
				`${keyword}${input}`
			);
			for (let i = 0; i < rowInputs.length; i++) {
				rowDatas[`column ${i + 1}`] = rowInputs[i].value;
			}

			tableStore.put(rowDatas);
		}
	}

	getConfirmResult() {
		let confirmBtnEl = document.querySelector(confirmBtn);
		confirmBtnEl = confirmBtnEl.replaceWith(document.importNode(confirmBtnEl, true));
		confirmBtnEl = document.querySelector(confirmBtn);

		new ConfirmPopup(
			[
				{
					message: "Are You Sure? All the Previous Data Will Get Deleted!",
					selector: ".schedule-maker__update-table",
				},
				{
					message: "Are You Sure?",
					selector: ".schedule-maker__reset-table",
				},
			],
			[".confirm-popup__close", "#yes", "#no"]
		);


		const promise = new Promise((resolve) => {
			confirmBtnEl.addEventListener("click", () => {
				resolve(true);
			});
		});

		
		return promise;
	}

	connectSaveBtn() {
		const saveBtn = document.querySelector(`${keyword}${saveTable}`);
		saveBtn.addEventListener("click", () => {
			const tableElement = document.importNode(document.querySelector(`${weeklyTableClassName}`), true);
			tableElement.classList.add(`${savedTableClassName}`);

			const saveTableBtn = document.createElement("button");
			saveTableBtn.textContent = "Save it For Me!";
			saveTableBtn.className = "btn";

			const script = document.createElement("script");
			script.textContent = `
				const saveBtn = document.querySelector(".btn");
				saveBtn.addEventListener("click", () => {
					saveBtn.parentNode.removeChild(saveBtn);
					window.print();
					document.body.appendChild(saveBtn);
				})
			`;

			const tableTab = window.open();
			
			tableTab.document.write(`<head><link rel="stylesheet" href="${tableHref}"></link></head><body></body>`)
			tableTab.document.body.appendChild(tableElement);
			tableTab.document.body.appendChild(saveTableBtn);
			tableTab.document.body.appendChild(script);

		})
	}

	connectResetBtn() {
		const resetTableBtn = document.querySelector(`${keyword}${resetTable}`);
		resetTableBtn.addEventListener("click", () => {
			this.getConfirmResult().then((confirmed) => {
				if (confirmed) {
					const transaction = database.transaction(
						"tableDatas",
						"readwrite"
					);
					const tableStore = transaction.objectStore("tableDatas");
					const clearRequest = tableStore.clear();
					clearRequest.onsuccess = () => {
						this.updateTable();
					};
				}
			});
		});
	}

	connectUpdateBtn() {
		const updateTableBtn = document.querySelector(
			`${keyword}${updateTable}`
		);

		updateTableBtn.addEventListener("click", () => {
			this.getConfirmResult().then((confirmed) => {
				if (confirmed) {
					this.updateStorage();
					this.updateTable();
				}
			});
		});
	}
}
