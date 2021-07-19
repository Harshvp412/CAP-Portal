import { useState, useEffect } from "react";
import { Layout, Row, Col, Button, Tooltip, Typography, Drawer, Descriptions, Divider } from "antd";
import "./Dashboard.css";
import DashboardSteps from "./DashboardSteps";
import { UserOutlined, TrophyOutlined, LogoutOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import Axios from "axios";
import openNotification from "../../utils/openAntdNotification";
import AvatarUploader from "./AvatarUploader";
import ChangePasswordModal from "./ChangePasswordModal";

const axios = Axios.create({
    baseURL: "https://ecell.iitm.ac.in/data",
    withCredentials: true,
});

const { Header, Content } = Layout;
const { Title } = Typography;

function Dashboard() {
    const [state, setState] = useState({ visible: false });
    const [ambassador, setAmbassador] = useState({});
    const [task, setTask] = useState({ taskName: "", avenue: "" });
    const [visibleAvatarUpdater, setVisibleAvatarUpdater] = useState(false);
    const [passwordResetModalVisible, setPasswordResetModalVisible] = useState(false);
    const history = useHistory();

    const getTask = async () => {
        try {
            const res = await axios.get("/cap-portal/task", { withCredentials: true });
            if (res.data.data.task.taskName !== "") {
                await setTask({ ...task, taskName: res.data.data.task.taskName });
            }
        } catch (error) {
            console.log("no tasks found");
        }
    };

    const getAvatar = async () => {
        const res = await axios.get("https://ecell.iitm.ac.in/data/cap-portal/avatar", { withCredentials: true });
        const avatarURL = res.data.data;
        if (avatarURL) {
            localStorage.setItem("avatarURL", avatarURL);
        }
    };
    useEffect(() => {
        getTask();
        getAvatar();
        const ambassador = JSON.parse(localStorage.getItem("user"));
        setAmbassador({ ...ambassador, avatarURL: localStorage.getItem("avatarURL") });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showDrawer = async () => {
        setState({
            visible: true,
        });
        await getAvatar();
        setAmbassador({ ...ambassador, avatarURL: localStorage.getItem("avatarURL") });
    };

    const onClose = () => {
        setState({
            visible: false,
        });
        setVisibleAvatarUpdater(false);
    };
    const handleLogout = async () => {
        try {
            await axios.get("https://ecell.iitm.ac.in/data/cap-portal/logout", { withCredentials: true });
            localStorage.removeItem("user");
            localStorage.removeItem("avatarURL");
            history.push("/cap-p/login");
        } catch (error) {
            const errMsg = error.response ? error.response.data.msg : error.message;
            openNotification("error", errMsg);
        }
    };
    return (
        <Layout className="layout">
            <Header style={{ backgroundColor: "#3e2541" }}>
                <Row>
                    <Col
                        xs={{ span: 17, offset: 0 }}
                        sm={{ span: 18, offset: 0 }}
                        md={{ span: 21, offset: 0 }}
                        lg={{ span: 21, offset: 0 }}>
                        <Title
                            style={{
                                paddingTop: 10,
                                color: "white",
                                textAlign: "left",
                                fontSize: 35,
                                fontFamily: "Andika",
                                fontWeight: 30,
                            }}>
                            Dashboard
                        </Title>
                    </Col>
                    <Col
                        xs={{ span: 3, offset: 0 }}
                        sm={{ span: 2, offset: 0 }}
                        md={{ span: 1, offset: 0 }}
                        lg={{ span: 1, offset: 0 }}>
                        <Tooltip title="Profile">
                            <Button type="primary" shape="circle" icon={<UserOutlined />} onClick={showDrawer} />
                        </Tooltip>
                    </Col>
                    <Col
                        xs={{ span: 3, offset: 0 }}
                        sm={{ span: 2, offset: 0 }}
                        md={{ span: 1, offset: 0 }}
                        lg={{ span: 1, offset: 0 }}>
                        <Tooltip title="Leader Board">
                            <Link to="/cap-p/leaderboard">
                                <Button type="primary" shape="circle" icon={<TrophyOutlined />} />
                            </Link>
                        </Tooltip>
                    </Col>
                    <Col
                        xs={{ span: 1, offset: 0 }}
                        sm={{ span: 2, offset: 0 }}
                        md={{ span: 1, offset: 0 }}
                        lg={{ span: 1, offset: 0 }}>
                        <Tooltip title="Log Out">
                            <Button type="primary" shape="circle" icon={<LogoutOutlined />} onClick={handleLogout} />
                        </Tooltip>
                    </Col>
                </Row>

                <Drawer width={340} placement="right" closable={false} onClose={onClose} visible={state.visible}>
                    <Col span={24} style={{ paddingTop: "1em", textAlign: "center" }}>
                        {ambassador.avatarURL ? (
                            <img
                                src={ambassador.avatarURL}
                                alt={ambassador.name}
                                style={{ borderRadius: "100%", width: "80%" }}
                            />
                        ) : (
                            <div onClick={onClose}>
                                {" "}
                                <AvatarUploader ambassador={ambassador} />
                            </div>
                        )}
                    </Col>

                    <Title level={3} style={{ textAlign: "center" }}>
                        {ambassador.name}
                    </Title>
                    <Descriptions title="">
                        <Descriptions.Item span={12} label="Email">
                            {ambassador.email}
                        </Descriptions.Item>
                        <Descriptions.Item span={12} label="Institution">
                            {ambassador.collegeName}
                        </Descriptions.Item>
                        <Descriptions.Item span={12} label="Points">
                            {ambassador.points}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />
                    <Button
                        icon={<EditOutlined />}
                        type="primary"
                        target="_blank"
                        shape="round"
                        block={true}
                        onClick={() => setPasswordResetModalVisible(true)}>
                        Update password
                    </Button>
                    <ChangePasswordModal
                        visible={passwordResetModalVisible}
                        setVisible={setPasswordResetModalVisible}
                    />

                    {ambassador.avatarURL ? (
                        <Col span={24} style={{ paddingTop: "1em", textAlign: "center" }}>
                            <Divider />
                            <Button
                                icon={<EditOutlined />}
                                type="primary"
                                shape="round"
                                block={true}
                                onClick={() => {
                                    setVisibleAvatarUpdater(true);
                                }}>
                                Update Profile Picture
                            </Button>
                            {
                                <div onClick={onClose} hidden={!visibleAvatarUpdater}>
                                    <Divider /> <AvatarUploader ambassador={ambassador} />
                                </div>
                            }
                        </Col>
                    ) : null}
                    <Divider />
                </Drawer>
            </Header>
            <Content style={{ padding: "0 50px", minHeight: 750 }}>
                <Row style={{ paddingTop: 20 }}>
                    <Col span={24}>
                        <Title style={{ textAlign: "center" }} level={3}>
                            Nice to see you, {ambassador.name}!
                        </Title>
                    </Col>
                </Row>
                {task.taskName !== "" || undefined ? <DashboardSteps ambassador={ambassador} inputTask={task} /> : null}
            </Content>
        </Layout>
    );
}

export default Dashboard;
