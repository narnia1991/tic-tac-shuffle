import styled from "@emotion/styled";
import { onValue, ref, set } from "firebase/database";
import { FC, RefObject, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { ROOT_URL } from "../../App";
import { db } from "../../firebase";
import { fallBackFont, textPrimary } from "../../variables";
import Button from "../common/Button";
import Input from "../common/Input";
import Modal from "../common/Modal";

const Container = styled.div`
  display: flex;
`;

const ButtonContainer = styled(Container)`
  justify-content: flex-end;
  margin-right: 1rem;
  align-items: flex-end;
`;

const PlayerContainer = styled(Container)`
  flex-direction: column;
  height: 70%;
  padding: 3rem;
`;

const InputContainer = styled(Container)`
  align-items: center;
  margin: 1rem;
`;

const Label = styled.label`
  color: ${textPrimary};
  margin-right: 2rem;
  font-family: ${fallBackFont};
  font-size: 1.5rem;
`;

type Props = {
  isOpen: boolean;
  onClose(): void;
  isTwoPlayer: boolean;
};

const StartGameModal: FC<Props> = ({ isOpen, onClose, isTwoPlayer }) => {
  const userId = localStorage.getItem("userId");

  const handleCloseModal = useCallback(() => {
    onClose();
  }, [onClose]);

  const navigate = useNavigate();

  const p1Ref: RefObject<HTMLInputElement> = useRef(null);
  const roundCountRef: RefObject<HTMLInputElement> = useRef(null);

  const handleCreateGame = useCallback(() => {
    const player1 = p1Ref.current;
    const roundCount = roundCountRef.current;

    const uuid = uuidv4();

    if (!player1) {
      return;
    }

    const p1Name = player1.value;
    const rCount = roundCount?.value ?? 1;

    try {
      const sessionRef = ref(db, uuid);

      set(sessionRef, {
        p1Id: userId,
        p1Name,
        rCount,
        r1Moves: [],
        matchType: isTwoPlayer ? "PVP" : "VSAI",
        isGameEnded: false,
      });

      navigate(`${ROOT_URL}/${uuid}`);
    } catch (err) {
      console.log(err);
    } finally {
      onClose();
    }
  }, [onClose, isTwoPlayer]);

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal}>
      <PlayerContainer>
        <InputContainer>
          <Label>Nickname:</Label>
          <Input name="player1" forwardRef={p1Ref}></Input>
        </InputContainer>
        <InputContainer>
          <Label>No of Matches:</Label>
          <Input
            name="player2"
            forwardRef={roundCountRef}
            type="number"
          ></Input>
        </InputContainer>
      </PlayerContainer>
      <ButtonContainer>
        <Button variant="text" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button variant="text" onClick={handleCreateGame}>
          Create
        </Button>
      </ButtonContainer>
    </Modal>
  );
};

export default StartGameModal;
