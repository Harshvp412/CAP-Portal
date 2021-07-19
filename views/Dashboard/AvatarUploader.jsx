import React, { useState } from "react";
import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import Axios from "axios";
import openNotification from "../../utils/openAntdNotification";

const axios = Axios.create({
    baseURL: "https://ecell.iitm.ac.in/data",
    withCredentials: true,
});

const AvatarUploader = (props) => {
    const { ambassador } = props;

    const [avatar, setAvatar] = useState(null);

    function beforeUpload(file) {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Image must smaller than 2MB!");
        }
        setAvatar(file);
        console.log(file, "singlefile");
        return isJpgOrPng && isLt2M;
    }

    const uploadButton = (
        <div>
            {<PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload Avatar</div>
        </div>
    );

    const upload = (type, file) => {
        return async () => {
            try {
                const res = await axios.get(`/cap-portal/s3-signed-policy/cap-${type}s`);

                let S3SignedPolicyObject = { ...res.data.data };
                let bucketWriteUrl = `https://${S3SignedPolicyObject.bucket}.s3.ap-south-1.amazonaws.com/`;

                const filename = `${ambassador.name.replace(/ /g, "")}-${ambassador.email}.${file.name.split(".").pop()}`;

                async function makeFormdataAndUpload() {
                    var fd = new FormData();

                    fd.append("x-amz-algorithm", "AWS4-HMAC-SHA256");
                    fd.append("acl", S3SignedPolicyObject.bucketAcl);
                    fd.append("policy", S3SignedPolicyObject.encodedPolicy);
                    fd.append("x-amz-credential", S3SignedPolicyObject.amzCred);
                    fd.append("x-amz-date", S3SignedPolicyObject.expirationStrClean);
                    fd.append("X-Amz-Signature", S3SignedPolicyObject.sign);

                    fd.append("key", filename);
                    fd.append("Content-Type", file.type);

                    fd.append("file", file);

                    await axios.post(bucketWriteUrl, fd, { withCredentials: false });
                }
                await makeFormdataAndUpload();

                let URL = `${bucketWriteUrl}${filename}`;
                const ambassadorID = ambassador._id;
                await axios.put(`/cap-portal/ambassador/update-avatar`, { ambassadorID, [`${type}URL`]: URL });
            } catch (error) {
                const errMsg = error.response ? error.response.data.msg : error.message;
                console.log("error", error.response);
                openNotification("error", "Error in uploading.", errMsg);
            }
        };
    };

    return (
        <>
            <ImgCrop rotate>
                <Upload
                    name="avatar"
                    customRequest={upload("avatar", avatar)}
                    listType="picture-card"
                    className="avatar-uploader"
                    multiple={false}
                    showUploadList={false}
                    beforeUpload={beforeUpload}>
                    {uploadButton}
                </Upload>
            </ImgCrop>
        </>
    );
};

export default AvatarUploader;
