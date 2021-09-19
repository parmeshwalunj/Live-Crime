import React, { useState } from "react";
import { Button, Modal, Form, FloatingLabel, Dropdown } from "react-bootstrap";
import { crimeTypes } from "../../util/tempCrimeData";
import { addCrime as addNewCrime } from "../../firebase/crimeApi";
import { getAuth } from "firebase/auth";

const AddCrime = ({ lat, lng, show, handleClose }) => {
  const [formData, setFormData] = useState({
    type: "other",
    landmarks: "",
    description: "",
    severity: "low",
    timestamp: "",
  });

  // update form while typing
  const inputEvent = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  // Add crime to db
  const SubmitDetails = (event) => {
    event.preventDefault();

    let date = new Date();
    let curTime = date.toLocaleString();

    const crimeObj = {
      ...formData,
      upvotes: 0,
      downvotes: 0,
      lat: lat,
      lng: lng,
      timestamp: curTime,
    };

    const successCallBack = () => {
      setFormData({
        type: "other",
        landmarks: "",
        description: "",
        severity: "low",
        timestamp: "",
      });
      handleClose();
    };
    const failureCallBack = (err) => {
      console.log(err);
      alert("An error occured while adding your crime! Please try again!");
    };

    let auth = getAuth();
    let user = auth.currentUser;
    addNewCrime(user, crimeObj, successCallBack, failureCallBack);
  };

  // to update select / dropdown values
  const handleSelectValue = (event) => {
    const name = event.target.name;
    const value = event.target.attributes.value.value;

    setFormData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title style={{ width: "100%", textAlign: "center" }}>
          Please Add crime details
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ overflow: "auto", maxHeight: "50vh" }}>
        <Form id="add-crime-form">
          <Form.Group
            className="mb-3"
            style={{ display: "flex", flexWrap: "wrap" }}
          >
            <Form.Group className="mb-3" style={{ marginRight: "5rem" }}>
              <Form.Label>Type</Form.Label>
              <Dropdown>
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-basic"
                  value={formData.type}
                >
                  {formData.type}
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ overflow: "auto", maxHeight: "15vh" }}>
                  {crimeTypes.map((crime, idx) => {
                    return (
                      <Dropdown.Item
                        key={idx}
                        name="type"
                        onClick={handleSelectValue}
                        value={crime}
                      >
                        {crime}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Severity</Form.Label>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {formData.severity}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    name="severity"
                    onClick={handleSelectValue}
                    value="low"
                  >
                    Low
                  </Dropdown.Item>
                  <Dropdown.Item
                    name="severity"
                    onClick={handleSelectValue}
                    value="medium"
                  >
                    Medium
                  </Dropdown.Item>
                  <Dropdown.Item
                    name="severity"
                    onClick={handleSelectValue}
                    value="high"
                  >
                    High
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Landmarks</Form.Label>
            <Form.Control
              value={formData.landmarks}
              name="landmarks"
              onChange={inputEvent}
              type="text"
              placeholder="Specify Landmarks"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Add Description</Form.Label>
            <FloatingLabel>
              <Form.Control
                value={formData.description}
                onChange={inputEvent}
                name="description"
                as="textarea"
                style={{ height: "6rem" }}
              />
            </FloatingLabel>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer style={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="primary"
          type="submit"
          form="add-crime-form"
          onClick={SubmitDetails}
        >
          Add Crime
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCrime;
