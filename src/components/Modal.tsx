import { FC, ReactNode } from "react";
import ReactModal from "react-modal";
import { bgColor, primary } from "../variables";

const styles = {
  overlay: {
    backgroundColor: `${primary}55`,
  },
  content: {
    backgroundColor: bgColor,
    padding: "1rem",
    width: "45vw",
    height: "max-content",
    margin: "auto",
  },
};

type Props = {
  isOpen: boolean;
  onClose(): void;
  children: ReactNode;
};

if (process.env.NODE_ENV !== "test") {
  ReactModal.setAppElement("#root");
}

const Modal: FC<Props> = ({ isOpen, onClose, children }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={styles}
      shouldCloseOnOverlayClick={true}
    >
      {children}
    </ReactModal>
  );
};

export default Modal;
