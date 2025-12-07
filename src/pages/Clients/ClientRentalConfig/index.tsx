import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import ClientRentalConfigView from "./view";

const ClientRentalConfig = () => {
  const { clientId } = useParams<{ clientId: string }>();

  useEffect(() => {
    document.title = "Client Rental Configuration | ESRM";
  }, []);

  if (!clientId) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="alert alert-danger mb-0" role="alert">
            Client ID is required
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb 
          title="Client Rental Configuration" 
          pageTitle="Clients" 
        />
        <Row>
          <Col lg={12}>
            <ClientRentalConfigView clientId={clientId} mode="view" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ClientRentalConfig;