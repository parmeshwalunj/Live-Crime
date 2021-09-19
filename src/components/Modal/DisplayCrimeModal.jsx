import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

import NearbyCrime from "./NearbyCrime";

const style = {
  title: {
    textAlign: "center",
  },
};

function DisplayCrime({ show, handleClose, crimeData }) {
  const [comment, setComment] = useState("");
  const [chats, setChats] = useState([]);
  console.log(crimeData);
  const addComment = () => {
    console.log("comment");
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} style={{}}>
        <Modal.Header>
          <Modal.Title style={style.title}>{crimeData.type}</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ overflow: "auto", maxHeight: "50vh" }}>
          <div>
            <NearbyCrime
              landmarks={crimeData.landmarks}
              type={crimeData.type}
              severity={crimeData.severity}
              description={crimeData.description}
              time={crimeData.timestamp}
            />
          </div>
          <div>Comments</div>
          <Button variant="primary" onClick={addComment}>
            Comment
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DisplayCrime;
