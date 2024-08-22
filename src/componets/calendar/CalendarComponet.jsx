/*TO DO: crea un calendario, usando anche una libreria , 
1) crea una modale al clik della casella che permetta all'utente di aggiungere i compiti del giorno*/
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarComponet = () => {
	const [goals, setGoals] = useState([]);
	const [show, setShow] = useState(false); //Stato dove setto la visibilita della modale
	const [description, setDescription] = useState(""); //Stato per il campo textarea
	const [selectedDate, setSelectedDate] = useState(null); //Stato per la data selezionata

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
			handleClose(); // Chiudi la modale e resetta gli stati
		}
	};

	const handleDateClick = (info) => {
		setSelectedDate(info.date); //Al clik inserisco la data della casella nello stato
		handleShow(); //Apre la modale per aggiungere un nuovo evento
	};

	const handleEventClick = (clickInfo) => {
		if (window.confirm(`Sei sicuro di voler eliminare l'obbiettivo ?`)) {
			setGoals(goals.filter((goal) => goal.id !== clickInfo.event.id));
		}
	};

	const handleEventCompleteToggle = (clickInfo) => {
		const updatedGoals = goals.map((g) => {
			if (g.id === clickInfo.event.id) {
				return { ...g, completed: !g.completed };
			}
			return g;
		});
		setGoals(updatedGoals);
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
				eventClick={(clickInfo) => {
					const action = prompt(
						'Scrivi "rimuovi" per eliminare o "svolto" per contrassegnare come svolto/non svolto:'
					);
					if (action === "rimuovi") {
						handleEventClick(clickInfo);
					} else if (action === "svolto") {
						handleEventCompleteToggle(clickInfo);
					}
				}}
				eventContent={(eventInfo) => {
					return (
						<div
							style={{ color: "white", padding: "5px", textAlign: "center" }}
						>
							{eventInfo.event.title}{" "}
						</div>
					);
				}}
			/>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Aggiungi l'Obbiettivo da raggiungere</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<textarea
						name="description"
						id="description"
						value={description} //Usa lo stato per il valore
						onChange={handleInputChange} //Usa la funzione aggiornata
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
