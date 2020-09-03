import React, { useState } from "react";
import { Link, Route } from "react-router-dom";
import photo from "../assets/img/backgroundDetail.png";
import Login from "./Login";
import Register from "./Register";
import CardTwo from "./card/CardTwo";
import iconHeader from "../assets/img/iconHeader.png";
import parse from "react-html-parser";
import "../assets/css/stylesheet.css";
import {
  Button,
  InputGroup,
  FormControl,
  Row,
  Col,
  Jumbotron,
  Card,
} from "react-bootstrap";
import axios from "axios";

export default function Home() {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const [keyword, setKeyword] = useState(null);
  const [journey, setJourney] = useState(null);

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
  return (
    <div style={{ width: "100%" }}>
      <Jumbotron>
        <Row>
          <Col xs={3}>
            <img src={iconHeader} className="HeadI"></img>
          </Col>
          <Col xs={{ span: 2, offset: 6 }}>
            <div className="btn-home mt-2" style={{ display: "inline-block" }}>
              <Login /> <Register />
            </div>
          </Col>
        </Row>
        <div className="mt-3 ml-5">
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
          </Col>
        </Row>
      </div>
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

                {/* <div
                  className="circle"
                  onClick={(e) => handleSubmit(e, dest.id)}
                >
                  <img src={wishlist} />
                </div> */}

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
                    {formatter.format(Date.parse(dest.createdAt))}-
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
  );
}
