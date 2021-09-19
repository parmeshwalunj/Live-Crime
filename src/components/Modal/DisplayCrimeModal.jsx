import React, { useEffect, useState } from "react";
import { Button, Modal, Form, ListGroup } from "react-bootstrap";
import { addMessage, getMessagesListener } from "../../firebase/crimeApi";
import NearbyCrime from "./NearbyCrime";
import { getAuth } from "firebase/auth";

const style = {
  title: {
    textAlign: "center",
  },
};

function DisplayCrime({ show, handleClose, crimeData, messages }) {
  const [comment, setComment] = useState("");
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubMessages = getMessagesListener(
      crimeData.id,
      setChats,
      console.log
    );

    return () => {
      unsubMessages();
    };
  }, [crimeData.id]);

  const addComment = () => {
    if (comment.trim()) {
      if (getAuth().currentUser === null) {
        alert("Please check if you are logged in!");
        return;
      }
      addMessage(
        getAuth().currentUser,
        crimeData.id,
        comment,
        () => {
          setComment("");
        },
        console.log
      );
    }
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
          <div>
            <ListGroup>
              {chats.map((chat, id) => (
                <ListGroup.Item key={id}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      alt={chat.creator_name}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        marginRight: 15,
                      }}
                      src={chat.creator_avatar}
                    />
                    <div>
                      <div style={{ fontWeight: 50 }}>{chat.creator_name}</div>
                      <div>{chat.message}</div>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
          <Form.Group style={{ display: "flex", marginTop: 15 }}>
            {/* <Form.Label>Add Comment</Form.Label> */}
            <Form.Control
              value={comment}
              name="comment"
              onChange={(event) => {
                setComment(event.target.value);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") addComment();
              }}
              type="text"
              placeholder="Add Comment"
            />
            <Button variant="primary" onClick={addComment}>
              Comment
            </Button>
          </Form.Group>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DisplayCrime;
