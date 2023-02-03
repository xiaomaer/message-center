import React, { useState, ChangeEvent } from 'react'
import { Modal, Button, Input, message } from 'antd';

type ConfirmLayerProps = {
    onConfirm: (value: string) => void;
}

export default function ConfirmLayer(props: ConfirmLayerProps) {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [value, setValue] = useState('');

    const handleOk = () => {
        if (!value) {
            message.warning('请输入验证码');
            return
        }
        sessionStorage.setItem('xm-token', value)
        setIsModalOpen(false);
        props.onConfirm(value);
    };

    const hanldeOnchange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    return (
        <Modal title="请输入验证码" closable={false} open={isModalOpen} footer={[
            <Button key="submit" type="primary" onClick={handleOk}>
                确认
            </Button>
        ]}>
            <Input value={value} type="password" onChange={hanldeOnchange} />
        </Modal>
    );
}