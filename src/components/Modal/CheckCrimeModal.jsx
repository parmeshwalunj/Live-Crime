import React from "react";
import { Button, Modal } from "react-bootstrap";

import NearbyCrime from "./NearbyCrime";

const style = {
  title: {
    textAlign: "center",
  },
};

function CheckCrime({ show, handleClose, crimeData, addCrime }) {
  return (
    <>
      <Modal show={show} onHide={handleClose} style={{}}>
        <Modal.Header>
          <Modal.Title style={style.title}>
            Please check whether the crime has already been marked
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ overflow: "auto", maxHeight: "50vh" }}>
          {crimeData.map((crime, idx) => {
            console.log(crime);
            return (
              <NearbyCrime
                key={idx}
                landmarks={crime.landmarks}
                type={crime.type}
                severity={crime.severity}
                description={crime.description}
                time={crime.timestamp}
              />
            );
          })}
        </Modal.Body>

        <Modal.Footer style={{ display: "flex", flexDirection: "column" }}>
          <h5>Unable to locate the crime?</h5>
          <Button variant="primary" onClick={addCrime}>
            Add Crime
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CheckCrime;
