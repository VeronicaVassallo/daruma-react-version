import "./navbarComponet.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

function NavbarComponet() {
	return (
		<Navbar id="nav" expand="lg" className="bg-body-tertiary">
			<Container fluid className="bg-danger">
				<Navbar.Brand href="#">
					<img className="logoDaruma me-2" src="/daruma-logo.png" alt="" />
					Daruma
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="navbarScroll" />
				<Navbar.Collapse id="navbarScroll">
					<Nav
						className="me-auto my-2 my-lg-0"
						style={{ maxHeight: "100px" }}
						navbarScroll
					>
						<Nav.Link href="#action1">Home</Nav.Link>
						<Nav.Link href="#action2">My Profile</Nav.Link>
						<Nav.Link href="#action3">Classifica</Nav.Link>
						<NavDropdown title="Actions" id="navbarScrollingDropdown">
							<NavDropdown.Item href="#action4">Log out</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item href="#action5">Impostazioni</NavDropdown.Item>
						</NavDropdown>
					</Nav>
					<div>TOT Daruma </div>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default NavbarComponet;
