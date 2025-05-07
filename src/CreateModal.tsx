import React from 'react'
import { Modal, Form, Input, InputNumber, Select, DatePicker, Switch } from 'antd';


type CreateModalProps = {
    visible: boolean;
    onConfirm: (values: object) => void;
    onCancel: () => void;
}


// const config = {
//     rules: [{ type: 'object' as const, required: true, message: '请选择时间' }],
// };

export default function CreateModal(props: CreateModalProps) {
    const [form] = Form.useForm();


    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log('Success:', values);
            props.onConfirm(form.getFieldsValue());
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    return (
        <Modal title="创建消息" open={props.visible} onOk={handleOk} onCancel={props.onCancel} width={800} cancelText="取消" okText="确定">
            <Form
                name="basic"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 800 }}
                initialValues={{ remember: true }}
                autoComplete="off"
                form={form}
            >
                <Form.Item
                    label="消息标题"
                    name="title"
                    rules={[{ required: true, message: '请输入消息标题' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="消息内容"
                    name="content"
                    rules={[{ required: true, message: '请输入消息内容' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="channelName" label="通知渠道" rules={[{ required: true, message: '请选择通知渠道' }]}>
                    <Select placeholder="请选择通知渠道" options={[{ value: '定时通知', label: '定时通知' }, { value: '报工提示', label: '报工提示' }]}></Select>
                </Form.Item>
                <Form.Item label="通知次数"
                    name="maxNotifyCount"
                    rules={[{ required: true, message: '通知次数' }]}>
                    <InputNumber precision={0} />
                </Form.Item>
                <Form.Item name="startAt" label="生效时间" >
                    <DatePicker placeholder='请选择生效时间' showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
                <Form.Item name="endAt" label="失效时间" >
                    <DatePicker placeholder='请选择失效时间' showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
                <Form.Item
                    label="cron规则"
                    name="spec"
                    rules={[{ required: true, message: '请输入cron规则' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="仅法定工作日"
                    name="workDay"
                >
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    );
}