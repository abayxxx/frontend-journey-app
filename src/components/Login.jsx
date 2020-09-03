import React, { useState, useContext } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { ContextUser } from "../components/context/ContextUser";
import logo from "../assets/img/logo.png";
import logo2 from "../assets/img/logo2.png";
import axios from "axios";
import { useMutation } from "react-query";

export default function Login() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { setContextUser } = useContext(ContextUser);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const checkUser = async () => {
    const response = await axios.post("http://localhost:5001/api/v2/login", {
      email: user.email,
      password: user.password,
    });
    localStorage.setItem("token", response.data.data.token);
    return response;
  };

  const [handleLogin, { status }] = useMutation(checkUser, {
    onSuccess: () => {
      setContextUser(true);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <>
      <Button
        variant="light"
        onClick={handleShow}
        style={{ width: 80 }}
        className="mb-2"
      >
        Login
      </Button>

      <Modal show={show} onHide={handleClose} keyboard={false}>
        <Modal.Body>
          {/* <img src={logo2} className="leaf" />
          <img src={logo} className="hibiscus" /> */}
          <div className="text text-center" style={{ fontSize: 30 }}>
            <p>Login</p>
          </div>

          <Form>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label className="TextF">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={user.email}
                onChange={(e) => handleChange(e)}
                name="email"
              />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlInput2">
              <Form.Label className="TextF">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={user.password}
                onChange={(e) => handleChange(e)}
                name="password"
              />
            </Form.Group>
            <div className="text-center mt-5">
              <Button
                type="submit"
                variant="warning"
                className="btn-form"
                onClick={(e) => handleSubmit(e)}
              >
                Login
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <div className="text-center mb-4">Don't have an account? Here</div>
      </Modal>
    </>
  );
}
