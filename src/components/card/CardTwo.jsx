import React, { useState, useEffect } from "react";
import photo from "../../assets/img/backgroundDetail.png";
import wishlist from "../../assets/img/menu2.png";
import { Link, Route, useParams } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { useQuery, useMutation } from "react-query";
import jwt from "jsonwebtoken";
import parse from "react-html-parser";

export default function CardTwo(keyword) {
  const user = jwt.decode(localStorage.getItem("token"));

  const formatter = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  // //get data bookmark
  // const getBookmark = async () => {
  //   const response = await axios.get(
  //     `http://localhost:5001/api/v2/bookmark/${user.id}`
  //   );

  //   return response.data.data.user;
  // };

  // const { isLoading: loadBookmark, data: dataBookmark } = useQuery(
  //   "bookmark",
  //   getBookmark
  // );

  // const checkBookmark = (idBookmark, idJourney) => {
  //   idBookmark.forEach((data) => {
  //     if (data.id !== idJourney) {
  //       return "black";
  //     } else {
  //       return "#2e86de";
  //     }
  //   });
  // };

  const checkImage = (params) => {
    let data;
    params.map((type) => {
      if (type.type === "figure") {
        data = type.props.children[0].props.src;
      }
    });
    return data;
  };

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

  const handleSubmit = (e, id) => {
    e.preventDefault();
    addBookmark(id);
  };

  //get data journey
  const getJourney = async () => {
    const response = await axios.get(`http://localhost:5001/api/v2/journey`);

    return response.data.data.journey;
  };

  const { isLoading, isError, data, error } = useQuery("journeys", getJourney);
  useEffect(() => {
    getJourney();
  }, [keyword]);

  if (isLoading) {
    return <p>Loading.....</p>;
  }

  return (
    <Row>
      {data.map((dest) => (
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

            {!localStorage.getItem("token") ? (
              ""
            ) : (
              <div
                className="circle"
                key={data.id}
                // style={{
                //   backgroundColor: checkBookmark(
                //     dataBookmark[0].journey,
                //     dest.id
                //   ),
                // }}
                onClick={(e) => handleSubmit(e, dest.id)}
              >
                <img src={wishlist} />
              </div>
            )}

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
                style={{ whiteSpace: "pre-line", fontFamily: "Product Sans" }}
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
  );
}
