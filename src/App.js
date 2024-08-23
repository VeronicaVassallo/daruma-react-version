import "./App.css";
//bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
//Componets
import NavbarComponet from "./componets/navbarComponent/NavbarComponet";
import CalendarComponet from "./componets/calendar/CalendarComponet";

function App() {
	return (
		<div className="app bg-dark text-light">
			<NavbarComponet />
			<CalendarComponet />
		</div>
	);
}

export default App;
