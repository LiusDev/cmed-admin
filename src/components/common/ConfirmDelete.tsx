import React from "react";
import { Box, Button, Modal } from ".";
import { ModalProps } from "./Modal";
import { PiWarningCircle } from "react-icons/pi";

interface ConfirmDeleteProps extends ModalProps {
    title: string;
    description?: string;
    handleDelete: () => void;
}

const ConfirmDelete = ({
    show,
    setShow,
    title,
    description,
    handleDelete,
}: ConfirmDeleteProps) => {
    return (
        <Modal show={show} setShow={setShow}>
            <Box className="w-full max-w-125 p-8 flex flex-col gap-6 items-center justify-center">
                <PiWarningCircle className="text-8xl text-danger" />
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
                        color="danger"
                        variant="rounded"
                        onClick={() => {
                            setShow(false);
                        }}
                    >
                        Huỷ
                    </Button>
                    <Button
                        color="success"
                        variant="rounded"
                        onClick={() => {
                            setShow(false);
                            handleDelete();
                        }}
                    >
                        Đồng ý
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default ConfirmDelete;
