import { useState } from "react";
import Axios from "axios";

import { Row, Col, Button, Form, Input, Select, message, Result, Divider, Space, Spin } from "antd";
import { HomeOutlined, CheckCircleOutlined } from "@ant-design/icons";

import "./Dashboard.css";
import FileUpload from "./FileUpload";

import openNotification from "../../utils/openAntdNotification";

const axios = Axios.create({
    baseURL: "https://ecell.iitm.ac.in/data",
    withCredentials: true,
});

const DashboardSteps = (props) => {
    const { ambassador, inputTask } = props;

    const [isUploading, setIsUploading] = useState(false);
    const [task, setTask] = useState({ taskName: inputTask.taskName, avenue: "" });
    const [selectedFiles, setSelectedFiles] = useState({});

    const handleAvenueChange = (input) => {
        console.log(input, "input");
        setTask({ ...task, avenue: input });
    };

    const changeHandler = async (files) => {
        await setSelectedFiles(files.fileList);
    };

    const next = () => {
        const current = state.current + 1;
        setState({ current });
    };

    const prev = () => {
        const current = state.current - 1;
        setState({ current });
        setTask({ ...task, avenue: "", urls: [] });
        setSelectedFiles({});
    };

    const stepOneContent = isUploading ? (
        <Row justify="center">
            <Col span={24} offset={24}>
                <Space size="middle" align="center">
                    <Spin size="large" />
                </Space>
                <Divider />
            </Col>
        </Row>
    ) : (
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Form id="submission-form" layout="vertical" size="large">
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item label="Task">
                            <Input value={task.taskName} disabled />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Avenue" required>
                            <Select allowClear onChange={handleAvenueChange}>
                                <Select.Option value="linkedin">LinkedIn</Select.Option>
                                <Select.Option value="whatsapp">Whatsapp</Select.Option>
                                <Select.Option value="instagram">Instagram</Select.Option>
                                <Select.Option value="email">Email</Select.Option>
                                <Select.Option value="others">Others</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Divider />
            <Row justify="center">
                <Col style={{ textAlign: "center" }}>
                    <FileUpload onChange={changeHandler} />
                </Col>
                <Divider />
            </Row>
        </div>
    );

    const stepTwoContent = (
        <Result
            status="success"
            title="Task completed succesfully!"
            subTitle={`Go to Home to upload files for another avenue. Next task will be updated soon. Keep an eye on the Leaderboard`}
            extra={[
                <Button type="primary" key="home" onClick={() => prev()}>
                    <HomeOutlined />
                    Home
                </Button>,
            ]}
        />
    );

    const steps = [
        {
            title: "First",
            content: stepOneContent,
        },
        {
            title: "Second",
            content: stepTwoContent,
        },
    ];

    const [state, setState] = useState({ current: 0 });

    const handleSubmit = async () => {
        if (task.avenue && selectedFiles.length) {
            setIsUploading(true);
            try {
                const res = await axios.get(`/cap-portal/s3-signed-policy/cap-submissions`);

                let S3SignedPolicyObject = { ...res.data.data };
                let bucketWriteUrl = `https://${S3SignedPolicyObject.bucket}.s3.ap-south-1.amazonaws.com/`;

                const files = selectedFiles;

                const urls = files.map((file) => {
                    let filename = `${ambassador.name.replace(/ /g, "")}-${file.uid}.${file.name.split(".").pop()}`;
                    console.log(filename, "filename");
                    const call = async () => {
                        await makeFormdataAndUpload(file, filename);
                    };
                    call();
                    let URL = `${bucketWriteUrl}${filename}`;
                    console.log(URL);
                    return URL;
                });

                await setTask({ ...task, urls: urls });

                async function makeFormdataAndUpload(file, filename) {
                    var fd = new FormData();

                    fd.append("x-amz-algorithm", "AWS4-HMAC-SHA256");
                    fd.append("acl", S3SignedPolicyObject.bucketAcl);
                    fd.append("policy", S3SignedPolicyObject.encodedPolicy);
                    fd.append("x-amz-credential", S3SignedPolicyObject.amzCred);
                    fd.append("x-amz-date", S3SignedPolicyObject.expirationStrClean);
                    fd.append("X-Amz-Signature", S3SignedPolicyObject.sign);

                    fd.append("key", filename);
                    fd.append("Content-Type", file.type);

                    fd.append("file", file.originFileObj);

                    await axios.post(bucketWriteUrl, fd, { withCredentials: false });
                }

                const updatedTask = { ...task, urls: urls };
                const sentTask = await axios.put("/cap-portal/update-task", { task: updatedTask });
                console.log(sentTask, "sentTask");
                setIsUploading(false);
                return true;
            } catch (error) {
                const errMsg = error.response ? error.response.data.msg : error.message;
                console.log("error", error.response);
                openNotification("error", "Error in registering.", errMsg);
            }
        } else if (!task.avenue) {
            openNotification("error", "Please select the Avenue");
            return false;
        } else if (!selectedFiles.length) {
            console.log(!selectedFiles.length, !selectedFiles.length);
            openNotification("error", "Please upload the files");
            return false;
        }
    };

    const current = state.current;

    return (
        <>
            <Row justify="center" style={{ paddingTop: 50 }}>
                <Col span={24} offset={0}>
                    <div className="steps-content">{steps[current].content}</div>
                </Col>
            </Row>
            <Row justify="center">
                <Col style={{ textAlign: "center" }}>
                    <div className="steps-action">
                        {current === steps.length - 2 && (
                            <Button
                                form="#myform"
                                hidden={isUploading}
                                type="primary"
                                style={{ paddingRight: 60, paddingLeft: 60 }}
                                onClick={async () => {
                                    const done = await handleSubmit();
                                    if (done === true) {
                                        message.success("Task complete!");
                                        next();
                                    }
                                }}>
                                <CheckCircleOutlined />
                                Done
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default DashboardSteps;
