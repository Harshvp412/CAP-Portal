import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { Form, Input, Button, Card, Row, Col, Layout } from "antd";

import openNotification from "../../utils/openAntdNotification";
import "./Register.css";

import VerificationModal from "./VerificationModal";

const { Header, Content } = Layout;

const Register = () => {
    const [verificationModalVisible, setVerificationModalVisible] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [formValues, setFormValues] = useState({});

    const register = async (values) => {
        setFormValues(values);
        setIsRegistering(true);
        try {
            // eslint-disable-next-line no-unused-vars
            const res = await axios({
                method: "post",
                url: "https://ecell.iitm.ac.in/data/cap-portal/verify-mail",
                data: { email: values.email },
                withCredentials: true,
            });
            setIsRegistering(false);
            setVerificationModalVisible(true);
        } catch (error) {
            setIsRegistering(false);
            const errMsg = error.response ? error.response.data.msg : error.message;
            console.log("error", error.response);
            openNotification("error", "Error in registering.", errMsg);
        }
    };

    return (
        <>
            <Header style={{ background: "#3E2541", textAlign: "center" }}>
                <h1 style={{ color: "#fefefe" }}>Campus Ambassador Program</h1>
            </Header>
            <Content className="register-form-container">
                <Card bordered={true} className="registerCard">
                    <h1 className="title">Sign Up</h1>
                    <Form name="register" onFinish={register} layout="vertical" scrollToFirstError size="large">
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="name"
                                    label="Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input your name!",
                                        },
                                    ]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="email"
                                    label="E-mail"
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
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    name="collegeName"
                                    label="Name of Institute "
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input your Institute Name.",
                                        },
                                    ]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="password"
                                    label="Password"
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input your Password.",
                                        },
                                        {
                                            min: 6,
                                            message: "Password should contain atleast 6 characters.",
                                        },
                                    ]}>
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item>
                            <Button
                                style={{ width: "100%" }}
                                type="primary"
                                className="button"
                                htmlType="submit"
                                loading={isRegistering}>
                                Register
                            </Button>
                        </Form.Item>
                        <VerificationModal
                            visible={verificationModalVisible}
                            setVisible={setVerificationModalVisible}
                            formValues={formValues}
                        />
                        <div style={{ textAlign: "center" }}>
                            Or <Link to="/cap-p/login">Login !</Link>
                        </div>
                    </Form>
                </Card>
            </Content>
        </>
    );
};

export default Register;
