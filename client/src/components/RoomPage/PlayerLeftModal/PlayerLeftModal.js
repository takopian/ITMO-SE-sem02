import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React from "react";


export const PlayerLeftModal = ({chooseIfRestart, chooseContinue, startGame, endGame, disabled}) => {
    return (
        <div className="playerLeftModalContainer">
            <Modal animation={false} show={chooseIfRestart}>
                <Modal.Body>
                    User left. Continue?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={chooseContinue} disabled={disabled}>
                        Continue
                    </Button>
                    <Button variant="primary" onClick={startGame} disabled={disabled}>
                        Restart
                    </Button>
                    <Button variant="secondary" onClick={endGame}>
                        End game
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
