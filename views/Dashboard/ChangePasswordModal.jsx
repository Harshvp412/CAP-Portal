import { useState } from "react";
import axios from "axios";

import { Button, Input, Form, Row, Col, Modal } from "antd";
import { KeyOutlined, SmileOutlined } from "@ant-design/icons";

import openNotification from "../../utils/openAntdNotification";
const { useForm } = Form;

const ChangePasswordModal = ({ visible, setVisible }) => {
    const [isUpdating, setUpdating] = useState(false);
    const [form] = useForm();

    const onPasswordFinish = async (values) => {
        setUpdating(true);
        try {
            const dataToPost = { passwords: values };
            const res = await axios.put("https://ecell.iitm.ac.in/data/cap-portal/change-password", dataToPost, {
                withCredentials: true,
            });
            if (res.data.success) {
                setUpdating(false);
                openNotification("success", "Password updated succesfully.")
                form.resetFields();
            }
        } catch (error) {
            setUpdating(false);
            console.log(error);
            openNotification("error", error.response.data.msg || error.message);
        }
    };
    return (
        <Modal visible={visible} footer={null} destroyOnClose={true} closable={false} zIndex={1003}>
            <Form layout="vertical" onFinish={onPasswordFinish} form={form}>
                <Form.Item
                    name="newPassword"
                    extra={
                        <span>
                            Keep it more than 6 letters. <SmileOutlined />
                        </span>
                    }
                    rules={[
                        {
                            min: 6,
                            message: "Please input at least 6 characters.",
                        },
                        {
                            required: true,
                            message: "Please input a new password if you want to change your current one.",
                        },
                    ]}
                    label={
                        <span>
                            <KeyOutlined /> New Password
                        </span>
                    }>
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="currentPassword"
                    rules={[{ required: true, message: "Please input your current password." }]}
                    label={
                        <span>
                            <KeyOutlined /> Current Password
                        </span>
                    }>
                    <Input.Password />
                </Form.Item>
                <Row gutter={[12, 0]} justify="end">
                    <Col>
                        <Button onClick={() => setVisible(false)}>Discard</Button>
                    </Col>
                    <Col>
                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button type="primary" htmlType="submit" loading={isUpdating}>
                                Change Password
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ChangePasswordModal;
