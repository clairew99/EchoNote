import {
  ModalContainer,
  ModalBackdrop,
  ModalHeader,
  ModalList,
  ModalButton,
  ModalItem,
} from "@components/styles/PdfSettingModal.style";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const PdfSettingModal = ({ isOpen, onClose, position, toggleAnalyzeModal }) => {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else if (visible) {
      setAnimate(true); // 닫기 애니메이션 시작
      const timer = setTimeout(() => {
        setAnimate(false);
        setVisible(false); // 애니메이션이 끝난 후 DOM에서 제거
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, visible]);

  if (!animate && !visible) return null;

  return (
    <ModalBackdrop
      className={isOpen ? "modal open" : "modal"}
      onClick={onClose}
    >
      <ModalContainer
        className={isOpen ? "modal-container open" : "modal-container"}
        style={{ top: position?.top, left: position?.left }}
      >
        <ModalHeader>
          <ModalButton onClick={toggleAnalyzeModal}>음성 분석</ModalButton>
          <ModalButton>키워드 설정</ModalButton>
        </ModalHeader>
        <ModalList>
          <ModalItem>태그</ModalItem>
          <ModalItem>파일로 저장</ModalItem>
          <ModalItem>손가락으로 그리기 켜기</ModalItem>
        </ModalList>
      </ModalContainer>
    </ModalBackdrop>
  );
};

PdfSettingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  position: PropTypes.object,
  toggleAnalyzeModal: PropTypes.func.isRequired,
};

export default PdfSettingModal;
