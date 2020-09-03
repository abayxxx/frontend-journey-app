import React, { useContext, useState, useEffect } from "react";
import logo from "../../assets/img/headerIcon.png";
import luffy from "../../assets/img/luffy.jpg";
import { ContextUser } from "../context/ContextUser";
import Register from "../Register";
import Login from "../Login";
import Dropdown from "../modal/Dropdown";
import { Row, Col, Container } from "react-bootstrap";
import { Link, Route } from "react-router-dom";
import { useQuery } from "react-query";
import jwt from "jsonwebtoken";
import axios from "axios";

export default function Header() {
  const { contextUser } = useContext(ContextUser);
  const user = jwt.decode(localStorage.getItem("token"));
  const [modal, setModal] = useState(false);

  const modalToggle = () => setModal(!modal);

  //get data user
  const fetchUser = async () => {
    if (!user) {
      return false;
    }

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(
      `http://localhost:5001/api/v2/user/${user.id}`,
      config
    );

    return response.data.data.users;
  };

  const { isLoading: loadUser, data: dataUser } = useQuery("user", fetchUser);
  const cekUser = () => {
    let user;

    if (contextUser) {
      user = (
        <div className="btn-header">
          <img
            src={dataUser.avatar}
            className="rounded-circle"
            style={{ width: 50, marginLeft: 80, height: 50 }}
            onClick={modalToggle}
          ></img>

          <Dropdown toggle={modal} style={{ left: 150 }} />
        </div>
      );
    } else {
      user = (
        <div className="btn-header mt-1 " style={{ left: 50 }}>
          <Login />
          <Register />
        </div>
      );
    }

    return user;
  };

  const cekLogin = () => {
    let layout;

    contextUser
      ? (layout = (
          <Route>
            <Link to="/user-home">
              <img src={logo} className="header-h"></img>
            </Link>
          </Route>
        ))
      : (layout = (
          <Route>
            <Link to="/">
              <img src={logo} className="header-h"></img>
            </Link>
          </Route>
        ));

    return layout;
  };

  if (loadUser) {
    return <p>Loading...</p>;
  }

  return (
    <nav style={{ backgroundColor: "#F1F1F1", zIndex: 10 }}>
      <Row>
        <Col xs={4}>{cekLogin()}</Col>
        <Col xs={{ span: 3, offset: 4 }}>{cekUser()}</Col>
      </Row>
    </nav>
  );
}
