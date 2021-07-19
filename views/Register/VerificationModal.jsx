import { useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";

import { Button, Input, Form, Modal, Row, Space, Typography } from "antd";

import openNotification from "../../utils/openAntdNotification";

const VerificationModal = ({ visible, setVisible, formValues }) => {
    const history = useHistory();
    const [isRegistering, setIsRegistering] = useState(false);

    const onFinish = async ({ verificationCode }) => {
        setIsRegistering(true);
        try {
            if (!document.cookie) return null;
            const verificationToken = document.cookie
                .split(";")
                .filter((str) => str.trim().startsWith("ECELL_CAP_VERIFICATION_TOKEN"))[0]
                .split("=")[1];

            if (verificationCode === verificationToken) {

                try {
                    const res = await axios({
                        method: "post",
                        url: "https://ecell.iitm.ac.in/data/cap-portal/register",
                        data: formValues,
                        withCredentials: true,
                    });
                    if (res.data.success) {
                        setIsRegistering(false);
                        console.log(res, "res")
                        localStorage.setItem("user", JSON.stringify(res.data.data))
                        history.push("/cap-p/dashboard");
                    } else {
                        setIsRegistering(false);
                    }
                } catch (error) {
                    const errMsg = error.response ? error.response.data.msg : error.message;
                    openNotification("error", errMsg);
                    setIsRegistering(false);
                    console.log("error", error);
                }
            } else {
                openNotification("error", "The code you entered is incorrect.", "");
            }
        } catch (err) {
            setIsRegistering(false);
            console.log(err);
        }
    };

    return (
        <Modal visible={visible} closable={false} footer={null} destroyOnClose={true}>
            <Form
                name="verificationModal"
                onFinish={onFinish}
                preserve={false}
                layout="vertical"
                validateTrigger="onSubmit">
                <Typography.Text strong>
                    Check the mail you've provided us! We've sent you an verification code.
                </Typography.Text>
                <br />

                <Form.Item
                    label="Insert the verification code here"
                    name="verificationCode"
                    rules={[{ required: true, message: "Please input the required code." }]}>
                    <Input />
                </Form.Item>

                <Row justify="end">
                    <Space>
                        <Form.Item style={{ marginBottom: "0" }}>
                            <Button htmlType="submit" type="primary" loading={isRegistering}>
                                Verify my E-Mail
                            </Button>
                        </Form.Item>
                        <Button onClick={() => setVisible(false)}>Discard</Button>
                    </Space>
                </Row>
            </Form>
        </Modal>
    );
};

export default VerificationModal;
