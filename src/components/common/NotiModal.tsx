import React from "react";
import { Box, Button, Modal } from ".";
import { ModalProps } from "./Modal";
import { PiCheckCircleLight, PiXCircleLight } from "react-icons/pi";

interface SuccessModalProps extends ModalProps {
    title: string;
    description?: string;
    type: "success" | "error";
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotiModal = ({
    show,
    setShow,
    title,
    description,
    type,
}: SuccessModalProps) => {
    return (
        <Modal show={show}>
            <Box className="w-full max-w-125 p-8 flex flex-col gap-6 items-center justify-center">
                {type === "success" ? (
                    <PiCheckCircleLight className="text-8xl text-success" />
                ) : (
                    <PiXCircleLight className="text-8xl text-danger" />
                )}
                <div className="flex flex-col gap-4">
                    <h3 className="text-2xl font-semibold text-center">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-center text-gray-500">
                            {description}
                        </p>
                    )}
                </div>
                <div className="flex items-center justify-center gap-4">
                    <Button
                        color="primary"
                        variant="rounded"
                        onClick={() => {
                            setShow(false);
                        }}
                    >
                        OK
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default NotiModal;
