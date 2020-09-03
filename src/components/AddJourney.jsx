import React, { useState } from "react";
import Header from "./layout/Header";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "@ckeditor/ckeditor5-react";
import axios from "axios";
import { useMutation } from "react-query";
import jwt from "jsonwebtoken";
import { Form, Col, Row, Button, Alert } from "react-bootstrap";
import { withRouter, useHistory } from "react-router-dom";

function AddJourney() {
  const user = jwt.decode(localStorage.getItem("token"));
  const history = useHistory();

  const [dataForm, setDataForm] = useState({
    title: "",
    description: "",
    userId: user.id,
  });

  const handleChangeTitle = (e) => {
    setDataForm({ ...dataForm, [e.target.name]: e.target.value });
  };

  const handleCKeditor = (event, editor) => {
    const data = editor.getData();
    setDataForm({ ...dataForm, description: data });
  };

  const addJourney = async () => {
    const data = await axios.post("http://localhost:5001/api/v2/journey", {
      ...dataForm,
    });

    return data;
  };

  const redirect = () => {
    window.location.href = "/user-home";
  };

  const [handleAddJourney, { status, data, error }] = useMutation(addJourney, {
    onSuccess: () => {
      history.push("/user-home");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddJourney();
  };

  return (
    <div>
      <Header />
      <div className="text-left ml-5 mt-5 mb-5">
        <p className="text" style={{ fontSize: 48 }}>
          Add Journey
        </p>
      </div>

      <div className="text-left" style={{ width: "90%" }}>
        <Row>
          <Col xs={{ span: 11, offset: 1 }}>
            {status === "error" ? (
              <Alert variant="danger">Check your data!!</Alert>
            ) : (
              ""
            )}
            <Form>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Insert your journey title"
                  value={dataForm.title}
                  onChange={(e) => handleChangeTitle(e)}
                  name="title"
                />
              </Form.Group>
              <Form.Group controlId="ckeditor">
                <Form.Label>Description</Form.Label>
                <CKEditor
                  data={dataForm.description}
                  name="description"
                  editor={ClassicEditor}
                  onInit={(editor) => {
                    // You can store the "editor" and use when it is needed.
                    //   console.log("Editor is ready to use!", editor);
                  }}
                  onChange={handleCKeditor}
                  config={{
                    ckfinder: {
                      uploadUrl: "http://localhost:5001/upload-image",
                    },
                  }}
                />
              </Form.Group>
              <div className="text-right">
                <Button
                  variant="primary"
                  type="submit"
                  onClick={(e) => handleSubmit(e)}
                >
                  Submit
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default withRouter(AddJourney);
