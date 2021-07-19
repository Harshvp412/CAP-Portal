import React from "react";
import { Row, Col, Grid, Divider, Popover, Typography } from "antd";
import { WhatsAppOutlined } from "@ant-design/icons";
import layouts from "../utils/antd-layouts";

const { useBreakpoint } = Grid;

const ECellFooter = ({ developers }) => {
    const screen = useBreakpoint();
    const developerDetails = (
        <div>
            {developers.map((developer) => (
                <div key={developer.whatsappNum}>
                    <Typography.Link href={developer.profileURL} target="blank">
                        {developer.name}
                    </Typography.Link>{" "}
                    <WhatsAppOutlined /> :{" "}
                    <Typography.Text copyable={{ tooltips: false }}>{developer.whatsappNum}</Typography.Text>
                </div>
            ))}
        </div>
    );
    return (
        <Row>
            <Col
                {...layouts.oneFourthInLarge}
                offset={(screen?.md || screen?.lg) && 3}
                style={!(screen?.lg || screen?.md) && { textAlign: "center" }}>
                <div>
                    &copy;Developed by {!(screen?.lg || screen?.md) && <br />}
                    <strong>Web Operations | E-Cell | IIT Madras.</strong>
                    <br />
                    All Rights Reserved.
                </div>
            </Col>

            {!(screen?.lg || screen?.md) && <Divider />}

            <Col
                {...layouts.oneFourthInLarge}
                offset={(screen?.md || screen?.lg) && 6}
                style={!(screen?.lg || screen?.md) && { textAlign: "center" }}>
                <div>
                    <span>For issues related to the website, </span>
                    <Popover content={developerDetails}>
                        <Typography.Link>contact us.</Typography.Link>
                    </Popover>
                </div>
            </Col>
        </Row>
    );
};

export default ECellFooter;
