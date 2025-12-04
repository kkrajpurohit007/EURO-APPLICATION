import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Container } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { fetchLeads } from "../../slices/leads/lead.slice";
import { PAGE_TITLES } from "../../common/branding";

const Dashboard = () => {
  document.title = PAGE_TITLES.dashboard;
  const dispatch = useDispatch<any>();

  // Load leads on dashboard mount (after login)
  useEffect(() => {
    dispatch(fetchLeads({}));
  }, [dispatch]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Dashboard" pageTitle="Home" />

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title mb-4">
                    Welcome to Euro Scaffolds - Professional Scaffold & Equipment Rental Management System
                  </h4>
                  <p className="text-muted">
                    Your dashboard overview will appear here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
