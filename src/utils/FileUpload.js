import { PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { API_USER, BASE_URL, ERR_MSG, fail_msg } from "../Config/config";
import { message } from "antd";
function FileUpload(props) {
  const [image, setImage] = useState("");

  const handleUpload = (files) => {
    let formData = new FormData();

    const config = {
      header: {
        "content-type": "multipart/form-data",
      },
    };

    formData.append("file", files[0]);

    axios
      .post(`${BASE_URL}/${API_USER}/image`, formData, config)
      .then((result) => {
        if (result.data.success) {
          setImage(result.data.url);
          props.handleImage(result.data.url);
        } else {
          message.warning(fail_msg("upload your profile image"));
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Dropzone onDrop={handleUpload}>
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            style={{
              width: "320px",
              height: "250px",
              border: "1px solid gray",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input {...getInputProps()} />
            <PlusOutlined style={{ fontSize: "3rem" }} />
          </div>
        )}
      </Dropzone>
      <div style={{ width: "320px", height: "250px" }}>
        {image && (
          <img
            src={`${BASE_URL}/${image}`}
            alt="upload Image"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        )}
      </div>
    </div>
  );
}

export default withRouter(FileUpload);
