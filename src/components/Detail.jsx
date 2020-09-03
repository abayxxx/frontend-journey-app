import React, { useEffect } from "react";
import Header from "./layout/Header";
import luffy from "../assets/img/backgroundDetail.png";
import { Row, Col, Button, Form } from "react-bootstrap";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useQuery, useMutation } from "react-query";
import { useParams } from "react-router-dom";
import parse from "react-html-parser";

export default function Detail() {
  let { id } = useParams();
  const user = jwt.decode(localStorage.getItem("token"));

  const formatter = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  //detail bookmark
  const getDetailBookmark = async () => {
    const response = await axios.get(
      `http://localhost:5001/api/v2/journey-bookmark/${id}`
    );

    return response.data.data.journey[0];
  };

  const { isLoading: loadDetail, data: detailBookmark } = useQuery(
    "detailBookmark",
    getDetailBookmark
  );

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

  //Bookmark
  const addBookmark = async () => {
    const response = await axios.post(`http://localhost:5001/api/v2/bookmark`, {
      journeyId: id,
      userId: user.id,
    });

    console.log(response);
    return response.data.data.journey;
  };

  const [
    handleBookmark,
    { isLoading: loadBookmark, status, error },
  ] = useMutation(addBookmark, {
    onSuccess: () => {
      console.log("sukses");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleBookmark();
  };

  //Get Detail by Id
  const getDetailJourney = async () => {
    const response = await axios.get(
      `http://localhost:5001/api/v2/detail/${id}`
    );

    return response.data.data.journey[0];
  };

  const { isLoading, isError, data: detailJourney } = useQuery(
    "detailJourney",
    getDetailJourney
  );

  useEffect(() => {
    window.scroll(0, 0);
  }, [isLoading]);

  if (isLoading) {
    return <p>Loading.....</p>;
  }
  if (loadDetail) {
    return <p>Loading.....</p>;
  }
  console.log(detailJourney.description.includes("<p>"));
  return (
    <div>
      <Header />
      <div style={{ position: "relative", zIndex: -1 }}>
        <Row>
          <Col xs={{ span: 10, offset: 1 }}>
            <div
              className="text-left"
              style={{
                fontFamily: "Avenir",
                fontStyle: "normal",
                fontWeight: 800,
                fontSize: 48,
                marginTop: 60,
                zIndex: -4,
              }}
            >
              {detailJourney.title}
              <Row>
                <Col xs={6}>
                  <p
                    className="text-secondary text-left"
                    style={{
                      fontWeight: 0,
                      fontSize: 20,
                    }}
                  >
                    {formatter.format(Date.parse(detailJourney.createdAt))}
                  </p>
                </Col>
                <Col xs={{ span: 1, offset: 5 }}>
                  <p
                    className="text-left"
                    style={{
                      fontWeight: 0,
                      fontSize: 20,
                      zIndex: -999,
                    }}
                  >
                    {detailJourney.users.fullName}
                  </p>
                </Col>
              </Row>
            </div>

            <div className="text-left">
              <img
                src={checkImage(parse(detailJourney.description))}
                style={{
                  width: "100%",
                  height: 500,
                  borderRadius: 5,
                }}
              ></img>
            </div>

            <div className="text-left mt-5 ">
              {checkText(parse(detailJourney.description))}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
