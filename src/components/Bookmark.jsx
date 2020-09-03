import React, { useEffect, useState } from "react";
import Header from "./layout/Header";
import wishlist from "../assets/img/menu2.png";
import { Route, Link } from "react-router-dom";
import { Row, Col, Card, Alert } from "react-bootstrap";
import jwt from "jsonwebtoken";
import axios from "axios";
import { useQuery } from "react-query";
import parse from "react-html-parser";

export default function Bookmark() {
  const user = jwt.decode(localStorage.getItem("token"));
  const [status, setStatus] = useState("");
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

  // delete Bookmark
  const deleteBookmark = async (id, user) => {
    const response = await axios.delete(
      `http://localhost:5001/api/v2/delete/${id}/${user}`
    );
    setStatus(response.statusText);
    if (response.statusText) {
      getBookmark();
    }
    return response;
  };

  const handleSubmit = (e, id, user) => {
    e.preventDefault();
    deleteBookmark(id, user);
    getBookmark();
  };

  //get data bookmark
  const getBookmark = async () => {
    const response = await axios.get(
      `http://localhost:5001/api/v2/bookmark/${user.id}`
    );

    return response.data.data.user;
  };
  // useEffect(() => {
  //   getBookmark();
  // }, [status]);

  const { isLoading, isError, data, error } = useQuery("bookmark", getBookmark);

  if (isLoading) {
    return <p>Loading.....</p>;
  }

  return (
    <div>
      <Header />

      <div className="text-left ml-5 mt-5 mb-5">
        <p className="text" style={{ fontSize: 48 }}>
          Bookmark
        </p>
        {status === "OK" ? (
          <Alert variant="success" style={{ width: "50%" }}>
            Success remove journey
          </Alert>
        ) : (
          ""
        )}
      </div>
      <div>
        <Row>
          {data[0].journey.map((dest) => (
            <Col sm={3} key={dest.id}>
              <Card
                style={{ width: 300, height: 350 }}
                className="ml-2 mb-4 mt-5"
              >
                <Route>
                  <Link to={`/detail/${dest.id}`}>
                    <Card.Img
                      className="text-center"
                      style={{ width: 300, height: 200 }}
                      variant="top"
                      src={checkImage(parse(dest.description))}
                      key={dest.id}
                    />
                  </Link>
                </Route>
                <div
                  className="circle"
                  style={{ backgroundColor: "#2e86de" }}
                  onClick={(e) => handleSubmit(e, dest.id, user.id)}
                >
                  <img src={wishlist} />
                </div>
                <Card.Body>
                  <Card.Title
                    className="text-left title-text"
                    style={{
                      marginBottom: 0,
                      fontSize: 18,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {dest.title}
                  </Card.Title>
                  <p className="text-left text-secondary">
                    {formatter.format(Date.parse(dest.createdAt))},{" "}
                    {dest.users.fullName}
                  </p>
                  <div style={{ whiteSpace: "pre-line" }}>
                    <p className="desc-text text-left">
                      {checkText(parse(dest.description))}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
