import { WechatOutlined } from "@ant-design/icons";
import { Card, Typography, Col, Row } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import { chatCategory } from "../../../Config/config";

const { Meta } = Card;
const { Title } = Typography;
function LandingPage(props) {
  const renderChatCards = () => {
    return chatCategory.map((category, index) => {
      return (
        <Col lg={12} xs={24}>
          <a href={category.url}>
            <Card
              hoverable
              cover={
                <img
                  style={{ maxHeight: "300px", objectFit: "contain" }}
                  alt={category.name}
                  src={category.img}
                />
              }
            >
              <Meta title={category.name} description={category.desc} />
            </Card>
          </a>
        </Col>
      );
    });
  };

  return (
    <div style={{ width: "85%", margin: "4rem auto" }}>
      <div>
        <Title level={3}>
          <WechatOutlined style={{ fontSize: "3rem" }} />
          <span style={{ marginLeft: "0.5rem" }}>Chat Category</span>
        </Title>
      </div>
      <div style={{ margin: "2rem auto" }}>
        <Row gutter={[32, 32]}>{renderChatCards()}</Row>
      </div>
    </div>
  );
}

export default withRouter(LandingPage);
