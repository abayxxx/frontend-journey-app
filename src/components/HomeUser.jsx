import React, { useState } from "react";
import backgroundImage from "../assets/img/background.png";
import wishlist from "../assets/img/menu2.png";
import CardTwo from "./card/CardTwo";
import iconHeader from "../assets/img/iconHeader.png";
import { Link, Route } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import jwt from "jsonwebtoken";
import Dropdown from "./modal/Dropdown";
import parse from "react-html-parser";
import "../assets/css/stylesheet.css";
import {
  Button,
  InputGroup,
  FormControl,
  Row,
  Col,
  Jumbotron,
  Form,
  Card,
} from "react-bootstrap";

export default function HomeUser() {
  const user = jwt.decode(localStorage.getItem("token"));
  const [keyword, setKeyword] = useState(null);
  const [journey, setJourney] = useState(null);
  const [modal, setModal] = useState(false);
  const modalToggle = () => setModal(!modal);

  const formatter = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  //image for descriptio
  const checkImage = (params) => {
    let data;
    params.map((type) => {
      if (type.type === "figure") {
        data = type.props.children[0].props.src;
      }
    });
    return data;
  };

  //text for description
  const checkText = (params) => {
    let data = [];
    params.map((type) => {
      if (type.type !== "figure") {
        data = type;
      }
    });
    return data;
  };

  // Add Bookmark
  const addBookmark = async (id) => {
    const response = await axios.post(`http://localhost:5001/api/v2/bookmark`, {
      journeyId: id,
      userId: user.id,
    });

    console.log(response);
    return response.data.data.journey;
  };

  const handleBookmark = (e, id) => {
    e.preventDefault();
    addBookmark(id);
  };

  //search
  const search = async () => {
    const response = await axios.get(
      `http://localhost:5001/api/v2/search/${keyword}`
    );

    setJourney(response.data.data.journey);
    return response.data.data.journey;
  };

  const handleChangeSearch = (e) => {
    setKeyword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    search();
  };

  //get data user
  const fetchUser = async () => {
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

  if (loadUser) {
    return <p>Loading...</p>;
  }

  console.log(journey);

  return (
    <div>
      <Jumbotron style={{ backgroundImage: { backgroundImage } }}>
        <Row>
          <Col xs={3}>
            <img src={iconHeader} className="HeadI mb-3"></img>
          </Col>
          <Col xs={{ span: 3, offset: 6 }}>
            <div className="btn-home" style={{ display: "inline-block" }}>
              <img
                src={dataUser.avatar}
                className="rounded-circle"
                style={{ width: 50, marginLeft: 95, height: 50 }}
                onClick={modalToggle}
              ></img>
              <Dropdown toggle={modal} />
            </div>
          </Col>
        </Row>
        <div className="mt-5 ml-5">
          <p className="text-home text-left">
            The Journey <br />
            you ever dreamed of.
          </p>
          <p
            className="text-home2 text-left"
            style={{ whiteSpace: "pre-wrap" }}
          >
            We made a tool so you can easily keep & share your travel memories.
            <br />
            But there is a lot more
          </p>
        </div>
      </Jumbotron>
      <p
        className="text-left ml-5"
        style={{ color: "black", fontWeight: 700, fontSize: 40 }}
      >
        Journey
      </p>
      <div className="search-content text-center">
        <Row>
          <Col xs={{ span: 8, offset: 2 }}>
            <Form>
              <InputGroup className="mb-5">
                <FormControl
                  placeholder="Search dulu sob..."
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  value={keyword || ""}
                  onChange={(e) => handleChangeSearch(e)}
                  name="title"
                />
                <InputGroup.Append>
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={(e) => handleSubmit(e)}
                  >
                    Search
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Form>
          </Col>
        </Row>
      </div>
      <div>
        {!journey ? (
          <CardTwo />
        ) : (
          <Row>
            {journey.map((dest) => (
              <Col sm={3} key={dest.id}>
                <Card style={{ width: 300, height: 350 }} className="ml-3 mb-4">
                  <Route>
                    <Link to={`/detail/${dest.id}`}>
                      <Card.Img
                        className="text-center"
                        style={{ width: 300, height: 200 }}
                        variant="top"
                        // src={process.env.PUBLIC_URL + `${dest.image}`}
                        src={checkImage(parse(dest.description))}
                        key={dest.id}
                      />
                    </Link>
                  </Route>

                  <div
                    className="circle"
                    onClick={(e) => handleBookmark(e, dest.id)}
                  >
                    <img src={wishlist} />
                  </div>

                  <Card.Body>
                    <Card.Title
                      className="text-left title-text"
                      style={{
                        marginBottom: 0,
                        fontSize: 19,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        fontFamily: "Product Sans",
                      }}
                    >
                      {dest.title}
                    </Card.Title>
                    <p className="text-left text-secondary">
                      {formatter.format(Date.parse(dest.createdAt))},{" "}
                      {dest.users.fullName}
                    </p>
                    <div
                      style={{
                        whiteSpace: "pre-line",
                        fontFamily: "Product Sans",
                      }}
                    >
                      <p className="desc-text text-left">
                        {checkText(parse(dest.description))}
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
