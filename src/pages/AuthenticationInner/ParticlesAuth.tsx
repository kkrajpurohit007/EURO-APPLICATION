import React from "react";
import withRouter from "../../Components/Common/withRouter";
import { AUTH_MESSAGES, COMPANY_NAME } from "../../common/branding";

const ParticlesAuth = ({ children }: any) => {
  return (
    <React.Fragment>
      <div className="auth-page-wrapper pt-5">
        {/* pass the children */}
        {children}
        <footer className="footer">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="text-center">
                  <p className="mb-0 text-muted">
                    {AUTH_MESSAGES.copyright}{" "}
                    <i className="mdi mdi-heart text-danger"></i> by{" "}
                    {COMPANY_NAME}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </React.Fragment>
  );
};

export default withRouter(ParticlesAuth);
