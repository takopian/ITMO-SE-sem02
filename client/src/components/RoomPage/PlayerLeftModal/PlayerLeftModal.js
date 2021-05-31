import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React from "react";


export const PlayerLeftModal = ({chooseIfRestart, chooseContinue, startGame, endGame, disabled}) => {
    return (
        <div className="playerLeftModalContainer">
            <Modal animation={false} show={chooseIfRestart}>
                <Modal.Body>
                    Пользователь покинул комнату. Продолжить игру?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={chooseContinue} disabled={disabled}>
                        Продолжить
                    </Button>
                    <Button variant="primary" onClick={startGame} disabled={disabled}>
                        Перезапустить
                    </Button>
                    <Button variant="secondary" onClick={endGame}>
                        Закончить игру
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
