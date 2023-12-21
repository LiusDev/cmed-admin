import React, { useState, useEffect, useRef } from "react";

export interface ModalProps {
    show: boolean;
    children?: React.ReactNode;
}

const Modal = ({ show, children }: ModalProps) => {
    return (
        show && (
            <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-black-2/10 z-99999 flex items-center justify-center">
                {children}
            </div>
        )
    );
};

export default Modal;
