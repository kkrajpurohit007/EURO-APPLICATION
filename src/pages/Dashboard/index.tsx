import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { fetchLeads } from "../../slices/leads/lead.slice";
import { PAGE_TITLES } from "../../common/branding";

const Dashboard = () => {
  document.title = PAGE_TITLES.dashboard;
  const dispatch = useDispatch<any>();
  const loading = useSelector((state: any) => state.Leads?.loading || false);
  const hasFetchedRef = useRef(false);

  // Load leads on dashboard mount (after login) - only once and if not already loading
  useEffect(() => {
    // Prevent multiple calls: only fetch if not already loading and not fetched yet
    if (!loading && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      dispatch(fetchLeads({ pageNumber: 1, pageSize: 500 }));
    }
  }, [dispatch, loading]);

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
