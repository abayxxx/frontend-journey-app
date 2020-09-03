import React, { useState, useEffect } from "react";
import Header from "./layout/Header";
import wishlist from "../assets/img/menu2.png";
import { Row, Col, Card, Form } from "react-bootstrap";
import jwt from "jsonwebtoken";
import { Link, Route, useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import parse from "react-html-parser";

export default function Profile() {
  const user = jwt.decode(localStorage.getItem("token"));

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

    return response.data.data.journey;
  };

  const handleSubmit = (e, id) => {
    e.preventDefault();
    addBookmark(id);
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

  //HandleUpload
  const [filePath, setFilePath] = useState(null);
  const [file, setFile] = useState("");
  const [successFile, setSuccessFile] = useState("");

  const updateAvatar = async () => {
    const response = await axios.patch(
      `http://localhost:5001/api/v2/user/${user.id}`,
      {
        avatar: filePath,
      }
    );

    console.log(response);
  };

  // useEffect(() => {
  //   updateAvatar();
  // }, [successFile === "Success Upload"]);

  const onChangeFile = async (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmitFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("upload", file);

    try {
      const data = await axios.post(
        "http://localhost:5001/upload-image",
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      );

      setFilePath(data.data.url);
      if (data.status === 200) {
        await updateAvatar();
        setSuccessFile("Success Upload");
      } else {
        setSuccessFile("Failed Upload");
      }
    } catch (err) {
      console.log(err);
    }
  };

  //get journey user
  const getJourneyUser = async () => {
    const response = await axios.get(
      `http://localhost:5001/api/v2/journey/${user.id}`
    );

    return response.data.data.journey;
  };

  const { isLoading, isError, data, error } = useQuery(
    "journeyUser",
    getJourneyUser
  );

  if (isLoading) {
    return <p>Loading.....</p>;
  }
  if (loadUser) {
    return <p>Loading.....</p>;
  }

  return (
    <div>
      <Header />

      <div className="text-left mt-4 ml-5">
        <p
          style={{
            fontFamily: "Avenir",
            fontStyle: "normal",
            fontWeight: 900,
            fontSize: 48,
            lineHight: 66,
          }}
        >
          Profile
        </p>
      </div>
      <div className="text-center">
        <Form.Group>
          <Form.File id="formcheck-api-regular">
            <Form.File.Label>
              {successFile ? (
                <img
                  src={filePath}
                  className="rounded-circle"
                  style={{ width: 200, height: 200 }}
                ></img>
              ) : (
                <img
                  src={dataUser.avatar}
                  className="rounded-circle"
                  style={{ width: 200, height: 200 }}
                />
              )}
            </Form.File.Label>
            <Form.File.Input
              style={{ display: "none" }}
              onChange={(e) => onChangeFile(e)}
            />
          </Form.File>

          <button
            type="submit"
            className="btn badge badge-primary"
            onClick={(e) => onSubmitFile(e)}
          >
            Change Photo
          </button>
        </Form.Group>

        <div>
          <p className="text">{dataUser.fullName}</p>
          <p className="text-secondary">{dataUser.email}</p>
        </div>
      </div>

      <Row className="mt-5">
        {data.map((dest) => (
          <Col sm={3} key={dest.id}>
            <Card
              style={{ width: 300, height: 350 }}
              className="ml-3 mb-4 mt-5"
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
                key={data.id}
                onClick={(e) => handleSubmit(e, dest.id)}
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
  );
}
