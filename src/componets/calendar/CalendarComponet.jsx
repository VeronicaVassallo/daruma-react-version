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

const CalendarComponet = () => {
	const [goals, setGoals] = useState([]); //lista di tutti gli obbiettivi
	const [show, setShow] = useState(false); //Stato dove setto la visibilita della modale
	const [description, setDescription] = useState(""); //Stato per il campo textarea
	const [selectedDate, setSelectedDate] = useState(null); //Stato per la data selezionata
	const [goalsFiltered, setGoalsFiltered] = useState([]); //Stato per gli obbiettivi filtrati in base al giorno

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
			const newGoal = {
				id: uuidv4(),
				description,
				start: selectedDate,
				allDay: true,
				completed: false,
			};
			setGoals([...goals, newGoal]);
			handleClose(); //Chiude la modale e resetta gli stati
		}
	};

	const handleDateClick = (info) => {
		setSelectedDate(info.date); //Al clik inserisco la data della casella nello stato
		filterGoals(info.date);
		handleShow(); //Apre la modale per aggiungere un nuovo evento
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
		const gF = goals.filter(
			(g) => new Date(g.start).getTime() === new Date(date).getTime()
		);
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
						<div style={{ color: "white", padding: "5px" }}>
							{eventInfo.event.title}{" "}
						</div>
					);
				}}
			/>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Tabella obiettivi: </Modal.Title>
				</Modal.Header>
				<img id="gifDaruma" src="darumagif.gif" alt="daruma" />
				<Modal.Body>
					{goalsFiltered.length > 0 ? (
						goalsFiltered.map((g) => (
							<div key={g.id}>
								<div className="d-flex justify-content-around">
									<div>
										{g.description}{" "}
										{g.completed ? (
											<MdCheckBox
												onClick={() => handleEventCompleteToggle(g.id)}
											/>
										) : (
											<MdCheckBoxOutlineBlank
												onClick={() => handleEventCompleteToggle(g.id)}
											/>
										)}
									</div>
									<div className="px-2">
										<BsTrash3Fill onClick={() => handleDeleteGoal(g.id)} />
									</div>
								</div>
							</div>
						))
					) : (
						<p>Nessun obiettivo per oggi.</p>
					)}
					<hr />
					<p>Aggiungi un nuovo obbiettivo</p>

					<textarea
						name="description"
						id="description"
						value={description}
						onChange={handleInputChange}
						rows="4"
					></textarea>
				</Modal.Body>
				<Modal.Footer>
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
