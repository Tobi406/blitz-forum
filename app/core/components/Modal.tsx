import { Button, Modal as ChakraModal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";

const Modal = ({
  disclosure,
  header,
  children,
  footer,
}: {
  disclosure: ReturnType<typeof useDisclosure>,
  header: JSX.Element | string,
  children?: JSX.Element,
  footer?: JSX.Element,
}) => {
  const {isOpen, onClose} = disclosure;
  
  return (
    <ChakraModal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {header}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {children}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={onClose}>
            Close
          </Button>
          {footer}
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};

export default Modal;
