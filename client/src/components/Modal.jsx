import React from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,

  } from "@heroui/react";

const Model = ({ isOpen, onOpenChange}) => {

  return (
          <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                    <ModalBody>
                      
                    </ModalBody>
                   
                  </>
                )}
              </ModalContent>
            </Modal>
          </>
        );
      }

export default Model