import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import React, {useState} from "react";

export const CreateRoom = ({setName_, setIsPrivate_, setGame_, createRoom}) => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [game, setGame] = useState('Дурак')


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleNameChange = (name) => {
        setName(name);
        setName_(name);
    }

    const handleGameChange = (game) => {
        setGame(game);
        setGame_(game);
    }

    const handleSave = () => {
        setShow(false);
        createRoom();
    }

    return (
        <div className="create-room-container">
            <Button variant="primary" onClick={handleShow}>
                Создать комнату
            </Button>

            <Modal animation={false} show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Создать комнату</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formGridState">
                            <Form.Label>
                                Название комнаты
                            </Form.Label>
                                <Form.Control
                                    type="name"
                                    value={name}
                                    placeholder=""
                                    onChange={({target: {value}}) => handleNameChange(value)}/>
                        </Form.Group>
                        <Form.Group  controlId="formGridState">
                            <Form.Label column sm={2}>
                                Игра
                            </Form.Label>
                            <Form.Control as="select" value={game} onChange={({target:{value}}) =>  handleGameChange(value)}>
                                <option> Дурак</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}


