import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";

import { Form, Input, Button, Card, Row, Col, Layout } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";

import openNotification from "../../utils/openAntdNotification";
import "./Login.css";

import ForgotPasswordModal from "./ForgotPasswordModal";

const { Header, Content } = Layout;

const Login = () => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [passwordResetModalVisible, setPasswordResetModalVisible] = useState(false);
    const history = useHistory();

    const logIn = async (values) => {
        setIsLoggingIn(true);
        try {
            // eslint-disable-next-line no-unused-vars
            const res = await axios({
                method: "post",
                url: "https://ecell.iitm.ac.in/data/cap-portal/login",
                data: values,
                withCredentials: true,
            });
            setIsLoggingIn(false);
            console.log(res, "res")
            localStorage.setItem("user", JSON.stringify(res.data.data))
            history.push("/cap-p/dashboard");
        } catch (error) {
            setIsLoggingIn(false);
            console.log("error", error);
            const errMsg = error.response ? error.response.data.msg : error.message;
            openNotification("error", errMsg);
        }
    };

    return (
        <>
            <Header style={{ background: "#3E2541", textAlign: "center" }}>
                <h1 style={{ color: "#fefefe" }}>Campus Ambassador Program</h1>
            </Header>
            <Content className="login-container">
                <Card bordered={true} className="loginCard">
                    <h1 className="title">Login</h1>
                    <Form name="login" onFinish={logIn} layout="vertical" scrollToFirstError size="large">
                        <Form.Item
                            name="email"
                            label="E-Mail"
                            rules={[
                                {
                                    type: "email",
                                    message: "The input is not valid E-mail!",
                                },
                                {
                                    required: true,
                                    message: "Please input your E-mail!",
                                },
                            ]}>
                            <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="E-Mail" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Password "
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your Password.",
                                },
                            ]}
                            extra={
                                <Button type="link" style={{ paddingLeft: 0 }} onClick={() => setPasswordResetModalVisible(true)}>
                                    Forgot password
                                </Button>
                            }>
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>

                        <ForgotPasswordModal visible={passwordResetModalVisible} setVisible={setPasswordResetModalVisible}/>

                        <Row>
                            <Col span={24}>
                                <Form.Item>
                                    <Button
                                        style={{ width: "100%" }}
                                        type="primary"
                                        htmlType="submit"
                                        loading={isLoggingIn}>
                                        Login
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                        <div style={{ textAlign: "center" }}>
                            Or <Link to="/cap-p/register">Register Now!</Link>
                        </div>
                    </Form>
                </Card>
            </Content>
        </>
    );
};

export default Login;
