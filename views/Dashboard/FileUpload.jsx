import React from "react";
import { Upload, Modal, message, Row, Col, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import openNotification from "../../utils/openAntdNotification";

const { Title } = Typography;

const supportedFileFormats = ["doc", "docx", "pdf"];

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

const props = {
    name: "file",
    multiple: true,
    showUploadList: {
        showPreviewIcon: true,
    },

    beforeUpload: (file) => {
        const isLt8M = file.size / 1024 / 1024 > 8;
        if (isLt8M) {
            openNotification("error", "The file must be within 8MB.", "Size error");
        }
        return false;
    },

    accept: ".doc,.docx,application/pdf,.png,image/",
};

class FileUpload extends React.Component {
    state = {
        previewVisible: false,
        previewImage: "",
        previewTitle: "",
        fileList: [],
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async (file) => {
        console.log("handling preview");
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
        });
    };

    handleChange = async (info) => {
        const { status } = info.file;
        if (status !== "uploading") {
            console.log(info.file, info.fileList);
        }
        if (status === "done") {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === "error") {
            message.error(`${info.file.name} file upload failed.`);
            console.log(info.file);
        }
        if (info.fileList.length > 8) {
            openNotification("error", "At most, 8 files can be uploaded at once ");
            this.setState({ ...this.state, fileList: [] });
            return;
        } else if (
            !(supportedFileFormats.includes(info.file.name.split(".").pop()) || info.file.type.startsWith("image/"))
        ) {
            console.log(info.file.type, "info.file.type");
            openNotification(
                "error",
                "Unsupported file Format",
                `${info.file.name} dosen't have a supported file format`
            );
            return;
        } else {
            await this.setState({ fileList: info.fileList });
            console.log(info.fileList, "filelist");
            if (this.props.onChange) {
                this.props.onChange(this.state);
            }
        }

        this.setState({
            ...this.state,
            fileList: info.fileList.filter((file, index) => file.size / 1024 / 1024 < 8),
        });
    };

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <>
                <Col>
                    <Row justify="center">
                        <Col>
                            {" "}
                            <Title level={5} style={{ textAlign: "center", paddingBottom: 30 }}>
                                Tap/Click '+' or drag and drop your files in the box.
                            </Title>
                        </Col>
                    </Row>

                    <Row justify="center">
                        <Col span={24} offset={0}>
                            <Upload
                                {...props}
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={this.handlePreview}
                                onChange={this.handleChange}>
                                {fileList.length >= 8 ? null : uploadButton}
                            </Upload>
                            <Modal
                                visible={previewVisible}
                                title={previewTitle}
                                footer={null}
                                onCancel={this.handleCancel}>
                                <img alt="example" style={{ width: "100%" }} src={previewImage} />
                            </Modal>
                        </Col>
                    </Row>
                </Col>
            </>
        );
    }
}
export default FileUpload;
