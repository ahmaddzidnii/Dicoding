import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, OverlayTrigger, Tooltip } from "react-bootstrap";
import { BiPhoneCall } from "react-icons/bi";
import { FaInstagram, FaYoutube, FaGithub } from "react-icons/fa";

const NavbarComponent = () => {
  const [changeColor, setChangeColor] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const changeBackgroundColor = () => {
    if (window.scrollY > 50 || isMenuOpen) {
      setChangeColor(true);
    } else {
      setChangeColor(false);
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    changeBackgroundColor();
    window.addEventListener("scroll", changeBackgroundColor);
    return () => {
      window.removeEventListener("scroll", changeBackgroundColor);
    };
  }, [isMenuOpen]);

  return (
    <>
      <Navbar collapseOnSelect
       expand="lg" 
       variant="dark" 
       fixed="top" 
       expanded={isMenuOpen} 
       className={changeColor ? "nav-scroled" : ""}>
        <Container>
          <Navbar.Brand href="#">ahmadzidni.</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={handleMenuToggle} />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mx-auto text-center fw-bold">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#skill">Skill</Nav.Link>
              <Nav.Link href="#portofolio">Portofolio</Nav.Link>
            </Nav>
            <Nav className="ms-auto text-center">
              <OverlayTrigger placement="bottom" overlay={<Tooltip id="instagram-tooltip">Instagram</Tooltip>}>
                <a className="text-white p-2 pe-1" target="_blank" href="https://www.instagram.com/ahmadzidni1/">
                  <FaInstagram className="fs-3 " />
                </a>
              </OverlayTrigger>
              <OverlayTrigger placement="bottom" overlay={<Tooltip id="youtube-tooltip">YouTube</Tooltip>}>
                <a className="text-white p-2 pe-1" target="_blank" href="https://www.youtube.com/@madzchannel3399">
                  <FaYoutube className="fs-3" />
                </a>
              </OverlayTrigger>
              <OverlayTrigger placement="bottom" overlay={<Tooltip id="github-tooltip">GitHub</Tooltip>}>
                <a className="text-white p-2 pe-1" target="_blank" href="https://github.com/ahmaddzidnii">
                  <FaGithub className="fs-3" />
                </a>
              </OverlayTrigger>
            </Nav>
            <Nav className="ms-auto text-center">
              <a className="btn btn-light d-inline fs-5" target="_blank" href="https://www.instagram.com/ahmadzidni1/">
                <BiPhoneCall /> Call
              </a>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarComponent;