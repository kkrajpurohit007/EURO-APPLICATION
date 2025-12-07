import React from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";

const BreadCrumb = ({ title, pageTitle, pageTitleLink }: any) => {
  // Determine the link for pageTitle - use provided link or default routes
  const getPageTitleLink = () => {
    if (pageTitleLink) return pageTitleLink;
    
    // Default routes based on common page titles
    if (pageTitle === "Meetings") return "/meetings/calendar";
    if (pageTitle === "Home") return "/";
    if (pageTitle === "Client Management") return "/clients";
    if (pageTitle === "Account Settings" || pageTitle === "Account") return "/account";
    if (pageTitle === "Settings") return "/settings";
    
    return "#";
  };

  return (
    <React.Fragment>
      <Row>
        <Col xs={12}>
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0">{title}</h4>

            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <Link to={getPageTitleLink()}>
                    <i className="ri-home-line align-middle me-1"></i>
                    {pageTitle}
                  </Link>
                </li>
                <li className="breadcrumb-item active">{title}</li>
              </ol>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BreadCrumb;
