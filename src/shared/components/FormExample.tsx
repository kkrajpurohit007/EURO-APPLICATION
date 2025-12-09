/**
 * Form Usage Example
 * Demonstrates how to use shared Input, Select, and Form components
 * 
 * This is a reference file - not meant to be imported
 */

import React from "react";
import { Row, Col } from "reactstrap";
import { Form, Input, Select, Button } from "./index";
import { useFormik } from "formik";
import * as Yup from "yup";

// Example: Using shared components in a form
const ExampleForm: React.FC = () => {
  const validation = useFormik({
    initialValues: {
      name: "",
      email: "",
      country: "",
      status: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      country: Yup.string().required("Country is required"),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const countryOptions = [
    { label: "United States", value: "us" },
    { label: "United Kingdom", value: "uk" },
    { label: "Canada", value: "ca" },
  ];

  return (
    <Form onSubmit={validation.handleSubmit}>
      <Row className="g-3">
        <Col md={6}>
          <Input
            label="Name"
            name="name"
            value={validation.values.name}
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            error={validation.touched.name ? validation.errors.name : undefined}
            touched={validation.touched.name}
            required
          />
        </Col>

        <Col md={6}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={validation.values.email}
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            error={validation.touched.email ? validation.errors.email : undefined}
            touched={validation.touched.email}
            required
          />
        </Col>

        <Col md={6}>
          <Select
            label="Country"
            options={countryOptions}
            value={countryOptions.find((o) => o.value === validation.values.country) || null}
            onChange={(option) => validation.setFieldValue("country", option?.value || "")}
            error={validation.touched.country ? validation.errors.country : undefined}
            touched={validation.touched.country}
            isRequired
            placeholder="Select country"
          />
        </Col>

        <Col md={12}>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ExampleForm;

