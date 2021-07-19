import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Highlighter from "react-highlight-words";

import { Button, Col, Divider, Layout, Row, Table, Typography, Input, Space, Spin } from "antd";
import {
    SearchOutlined,
    LogoutOutlined,
    NumberOutlined,
    UserOutlined,
    BankOutlined,
    ThunderboltOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

import "./Leaderboard.css";
import openNotification from "../../utils/openAntdNotification";

const { Header, Content } = Layout;
const { Title } = Typography;

const NoMarginHeading = ({ marginTop = 0, marginBottom = 0, marginRight = 0, marginLeft = 0, children, ...props }) => {
    return (
        <Title {...props} style={{ margin: `${marginTop}em ${marginRight}em ${marginBottom}em ${marginLeft}em` }}>
            {children}
        </Title>
    );
};

function Leaderboard() {
    const history = useHistory();
    const [currentUser, setCurrentUser] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchAndSetUsers = async () => {
        try {
            const res = await axios.get("https://ecell.iitm.ac.in/data/cap-portal/users", { withCredentials: true });
            setCurrentUser(res.data.data.currentUser);
            setAllUsers(res.data.data.allUsers);
            setLoading(false);
        } catch (error) {}
    };
    useEffect(() => {
        fetchAndSetUsers();
    }, []);

    const inputRef = useRef(null);
    const screen = useBreakpoint();

    //dataIndex not needed as only one column
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={inputRef}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}>
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : "",
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => inputRef.current.select(), 100);
            }
        },
        render: (text) =>
            searchText.length ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const handleLogout = async () => {
        try {
            await axios.get("https://ecell.iitm.ac.in/data/cap-portal/logout", { withCredentials: true });
            history.push("/cap-p/login");
        } catch (error) {
            const errMsg = error.response ? error.response.data.msg : error.message;
            openNotification("error", errMsg);
        }
    };

    const columns = [
        {
            title: (
                <span>
                    Rank <NumberOutlined />
                </span>
            ),
            dataIndex: "rank",
            key: "rank",
            align: "center",
            width: screen.md ? "15%" : "10%",
        },
        {
            title: (
                <span>
                    Name <UserOutlined />
                </span>
            ),
            dataIndex: "name",
            key: "name",
            width: screen.md ? "25%" : "14%",
            ...getColumnSearchProps("name"),
        },
        {
            title: (
                <span>
                    Institution <BankOutlined />
                </span>
            ),
            dataIndex: "collegeName",
            key: "collegeName",
            filters: allUsers.map((u) => ({ text: u.collegeName, value: u.collegeName })),
            onFilter: (value, user) => user.collegeName === value,

            sorter: (a, b) => a.collegeName.localeCompare(b.collegeName),
            sortDirections: ["ascend", "descend"],
            width: screen.md ? "45%" : "25%",
            responsive: ["sm", "md"],
        },
        {
            title: (
                <span>
                    Points <ThunderboltOutlined />
                </span>
            ),
            dataIndex: "points",
            key: "points",
            align: "center",

            sorter: (a, b) => a.points - b.points,
            sortDirections: ["ascend"],
            width: screen.md ? "15%" : "10%",
        },
    ];

    const usersPointsSorted = [...allUsers].sort((a, b) => b.points - a.points);
    const rankList = usersPointsSorted.map((user, i) => ({ ...user, rank: i + 1 }));

    return (
        <Layout className="App">
            <Header
                style={{
                    background: "#3E2541",
                    paddingLeft: !screen.md && "1em",
                    paddingRight: !screen.md && "1em",
                    fontFamily: "Andika",
                }}>
                <Row>
                    <Col span={6} style={{ fontSize: "large", textAlign: "left" }}>
                        <Button type="primary" style={{ color: "#fefefe" }} onClick={() => window.history.back()}>
                            <ArrowLeftOutlined /> Back
                        </Button>
                    </Col>
                    <Col span={12}>
                        <h1 style={{ textAlign: "center", color: "#fefefe" }}>
                            {screen.md && "Ambassador's"} Leaderboard
                        </h1>
                    </Col>
                    <Col span={6} style={{ fontSize: "large", textAlign: "right" }}>
                        <Button type="primary" style={{ textAlign: "center", color: "#fefefe" }} onClick={handleLogout}>
                            Logout <LogoutOutlined />
                        </Button>
                    </Col>
                </Row>
            </Header>
            <Content className="leaderboard-container">
                <Row
                    style={{
                        marginTop: "1em",
                        marginBottom: "1em",
                        zIndex: "10",
                        textAlign: "center",
                        background: "rgb(240, 242, 245)",
                    }}>
                    <h2 style={{ marginBottom: "0.1em" }}>Your ranking</h2>
                    <Divider style={{ marginTop: 0, paddingTop: 0 }} orientation="left" />
                    {loading ? (
                        <Space align="center" style={{ width: "100%", justifyContent: "center" }}>
                            <Spin size="large" />
                        </Space>
                    ) : (
                        <>
                            <Col xs={{ order: 2, span: 12 }} lg={{ order: 1, span: 6 }}>
                                <NoMarginHeading level={4}>Rank</NoMarginHeading>
                                <NoMarginHeading level={5} type="secondary">
                                    {rankList.findIndex((user) => user.email === currentUser.email) + 1}
                                </NoMarginHeading>
                            </Col>
                            <Col xs={{ order: 1, span: 24 }} lg={{ order: 2, span: 12 }}>
                                <NoMarginHeading level={4}>{currentUser.name}</NoMarginHeading>
                                <NoMarginHeading level={5} type="secondary">
                                    {currentUser.collegeName}
                                </NoMarginHeading>
                            </Col>
                            <Col order={3} xs={{ span: 12 }} lg={{ span: 6 }}>
                                <NoMarginHeading level={4}>Points</NoMarginHeading>
                                <NoMarginHeading level={5} type="secondary">
                                    {currentUser.points}
                                </NoMarginHeading>
                            </Col>
                        </>
                    )}
                </Row>
                <Row
                    style={{
                        zIndex: "3",
                        background: "rgb(240, 242, 245)",
                    }}>
                    <h2
                        style={{
                            marginBottom: "0.1em",
                        }}>
                        Leaderboard
                    </h2>
                    <Divider style={{ marginTop: 0, paddingTop: 0 }} />
                </Row>
                {loading ? (
                    <Space align="center" style={{ width: "100%", justifyContent: "center" }}>
                        <Spin size="large" />
                    </Space>
                ) : (
                    <Table
                        style={{ background: "#C6E0FF" }}
                        columns={columns}
                        dataSource={rankList}
                        pagination={false}
                        onRow={(user, i) => {
                            if (user.email === currentUser.email) {
                                return {
                                    style: { fontWeight: "bold" },
                                };
                            }
                        }}
                    />
                )}
            </Content>
        </Layout>
    );
}

export default Leaderboard;
