import "./calendarComponet.css";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
//FullCalendar
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
//react-icons
import { MdCheckBoxOutlineBlank } from "react-icons/md"; //icona non check
import { MdCheckBox } from "react-icons/md"; //icona checkata
import { BsTrash3Fill } from "react-icons/bs";

import { dataGoals } from "../../data/goals";

const CalendarComponet = () => {
	const [goals, setGoals] = useState(dataGoals); //lista di tutti gli obbiettivi
	const [show, setShow] = useState(false); //Stato dove setto la visibilita della modale
	const [description, setDescription] = useState(""); //Stato per il campo textarea
	const [selectedDate, setSelectedDate] = useState(null); //Stato per la data selezionata
	const [goalsFiltered, setGoalsFiltered] = useState([]); //Stato per gli obbiettivi filtrati in base al giorno
	const [message, setMessage] = useState(false); //Stato che mostra il messaggio se il campo textarea non è stato riempito correttamente
	const handleClose = () => {
		setShow(false);
		setDescription(""); //Reset del campo textarea
		setSelectedDate(null); //Reset della data
	};

	const handleShow = () => setShow(true);

	const handleInputChange = (e) => {
		setDescription(e.target.value);
	};

	const handleSave = () => {
		if (description && selectedDate) {
			setMessage(false);
			const newGoal = {
				id: uuidv4(),
				description,
				start: selectedDate,
				allDay: true, //FullCalendar considera , il calendario tratterà l'evento come un evento di un'intera giornata, quindi non è necessario specificare l'ora.
				completed: false,
			};
			setGoals([...goals, newGoal]);
			handleClose(); //Chiude la modale e resetta gli stati
		} else {
			setMessage(true);
		}
	};

	const handleDateClick = (info) => {
		const selectedISODate = info.dateStr; // Usa dateStr che è già in formato ISO
		setSelectedDate(selectedISODate); // Imposta la data come stringa ISO
		filterGoals(info.date); // Filtra gli obiettivi usando la data in oggetto Date
		handleShow(); // Apre la modale per aggiungere un nuovo evento
	};

	const handleEventClick = (clickInfo) => {
		setSelectedDate(clickInfo.event.start); // Imposta la data selezionata
		filterGoals(clickInfo.event.start); // Filtra gli obiettivi per la data dell'evento cliccato
		handleShow();
	};

	const handleEventCompleteToggle = (id) => {
		const updatedGoals = goals.map((g) => {
			if (g.id === id) {
				return { ...g, completed: !g.completed };
			}

			return g;
		});
		setGoals(updatedGoals);
		handleClose();
	};

	const filterGoals = (date) => {
		const normalizedDate = new Date(date);
		normalizedDate.setHours(0, 0, 0, 0); //resetto l'ora, perche altrimenti il filtro non funziona

		const gF = goals.filter((g) => {
			const goalDate = new Date(g.start);
			goalDate.setHours(0, 0, 0, 0);
			return goalDate.getTime() === normalizedDate.getTime();
		});

		setGoalsFiltered(gF);
	};

	const handleDeleteGoal = (id) => {
		/* eslint-disable no-restricted-globals */
		let shouldDelete = confirm("Sei sicuro di voler eliminare l'obiettivo?");
		/* eslint-enable no-restricted-globals */
		if (shouldDelete) {
			// Filtra gli obiettivi mantenendo quelli che non corrispondono all'ID
			const newListGoals = goals.filter((g) => g.id !== id);
			setGoals(newListGoals); // Aggiorna lo stato con la nuova lista
			handleClose(); // Chiudi la modale (opzionale)
		}
	};
	return (
		<>
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				events={goals.map((goal) => ({
					...goal,
					color: goal.completed ? "green" : "red",
					title: goal.description,
				}))}
				dateClick={handleDateClick}
				eventClick={handleEventClick}
				eventContent={(eventInfo) => {
					return (
						<div style={{ color: "white", padding: "5px", textWrap: "wrap" }}>
							{eventInfo.event.title}{" "}
						</div>
					);
				}}
			/>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton className="bg-danger">
					<Modal.Title className="nerko">TABELLA OBIETTIVI</Modal.Title>
				</Modal.Header>

				<Modal.Body className="bg-danger text-light">
					<div className="d-flex">
						<div id="Container-Goals">
							{goalsFiltered.length > 0 ? (
								goalsFiltered.map((g) => (
									<div key={g.id}>
										<div className="d-flex justify-content-between">
											<div>
												{g.description}{" "}
												{g.completed ? (
													<MdCheckBox
														className="cursor"
														onClick={() => handleEventCompleteToggle(g.id)}
													/>
												) : (
													<MdCheckBoxOutlineBlank
														className="cursor"
														onClick={() => handleEventCompleteToggle(g.id)}
													/>
												)}
											</div>
											<div className="px-2 cursor">
												<BsTrash3Fill onClick={() => handleDeleteGoal(g.id)} />
											</div>
										</div>
										<br />
										<hr />
									</div>
								))
							) : (
								<p>Nessun obiettivo per oggi !</p>
							)}
						</div>
						<div>
							<img id="Daruma-Modal" src="file.png" alt="daruma" />
						</div>
					</div>
					<div>
						<p className="nerko text-dark fs-4">Aggiungi un nuovo obbiettivo</p>

						<textarea
							name="description"
							id="description"
							value={description}
							onChange={handleInputChange}
							rows="4"
							placeholder="Ex. Completa 5 esercizi di matematica"
						></textarea>
						{!message ? <p></p> : <p>Inserisci un obbiettivo</p>}
					</div>
				</Modal.Body>
				<Modal.Footer className="bg-danger">
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" onClick={handleSave}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default CalendarComponet;
