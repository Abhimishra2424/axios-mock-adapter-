import React, { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import { FieldAttributes, Form, Formik, useField } from "formik";
import { Button, FormControlLabel, Radio, Typography } from "@material-ui/core";
import { Container, Grid, makeStyles, TextField } from "@material-ui/core";

import { Student } from "./types/student";
import useIsMountedRef from "./hooks/useIsMountedRef";

import axios from "./lib/axios";
import "./__mocks__";

type MyRadioProps = {
  label: string;
} & FieldAttributes<{}>;

const useStyles = makeStyles((theme) => ({
  formWrapper: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(8),
  },
}));

const MyRadio: React.FC<MyRadioProps> = ({ label, ...props }) => {
  const [field] = useField<{}>(props);

  return <FormControlLabel {...field} control={<Radio />} label={label} />;
};

const VALIDATION = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email.").required("Required"),
  address: Yup.string().required("Required"),
  gender: Yup.string().required("Required"),
  subject: Yup.number().required("Required"),
});

const App = () => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [student, setStudent] = useState<Student | null>(null);

  const getStudent = useCallback(async () => {
    try {
      const response = await axios.get<{ student: Student }>("/api/student");

      //{ student: Student }
      if (isMountedRef.current) {
        setStudent(response.data.student);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getStudent();
  }, [getStudent]);

  if (!student) {
    return null;
  }

  const clculateTotal = (subjects: any[]) => {
    let totalMarks = 0;
    subjects.forEach((x) => (totalMarks += x));
    return (totalMarks / 300) * 100;
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Container maxWidth="md">
          <div className={classes.formWrapper}>
            <Formik
              initialValues={{
                firstName: student.firstName || "",
                lastName: student.lastName || "",
                email: student.email || "",
                // phone: student.phone || "",
                address: student.address || "",
                gender: student.gender || "",
                subject: student.subject || [],
              }}
              validationSchema={VALIDATION}
              onSubmit={async (
                values,
                { resetForm, setErrors, setStatus, setSubmitting }
              ): Promise<void> => {
                try {
                  // NOTE: Make API request

                  axios
                    .post("/api/student", {
                      firstName: values.firstName,
                      lastName: values.lastName,
                      email: values.email,
                      address: values.address,
                      gender: values.gender,
                      subject: values.subject,
                    })
                    .then(function (response) {
                      console.log(response);
                    })
                    .catch(function (error) {
                      console.log(error);
                    });

                  await 500;
                  resetForm();
                  setStatus({ success: true });
                  setSubmitting(false);
                } catch (err) {
                  console.error(err);
                  setStatus({ success: false });
                  setSubmitting(false);
                }
              }}
              render={({
                handleChange,
                handleSubmit,
                handleBlur,
                errors,
                touched,
                values,
              }) => (
                <Form
                  onSubmit={handleSubmit}
                  style={{
                    boxSizing: "border-box",
                    top: 0,
                    left: 0,
                    backgroundColor: "#fff",
                    border: "1px solid #e3e3e3",
                    borderRadius: "16px",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        style={{
                          textAlign: "center",
                          color: "blue",
                          fontSize: 26,
                        }}
                      >
                        Student Registration Form
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="firstName"
                        value={values.firstName}
                        label="First Name"
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="lastName"
                        value={values.lastName}
                        label="Last Name"
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="email"
                        value={values.email}
                        label="Email"
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      {/* <FieldArray
                        name="phone"
                        render={({ remove, push }) => (
                          <>
                            {values.phone.map((phonenum, i) => (
                              <div key={i}>
                                <TextField
                                  name={`phone[${i}]`}
                                  label="Enter Number"
                                  variant="outlined"
                                  fullWidth
                                  margin="normal"
                                  value={phonenum}
                                  type="number"
                                  onChange={handleChange}
                                />
                                <Button
                                  variant="text"
                                  color="primary"
                                  size="small"
                                  type="button"
                                  onClick={() => remove(i)}
                                >
                                  Delete
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="text"
                              color="primary"
                              type="button"
                              size="small"
                              onClick={() => push("")}
                            >
                              Add
                            </Button>
                          </>
                        )}
                      /> */}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="address"
                        value={values.address}
                        label=" Enter The Address"
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        multiline={true}
                        rows={4}
                        error={touched.address && Boolean(errors.address)}
                        helperText={touched.address && errors.address}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography style={{ color: "blue" }}>
                        Select Gender
                      </Typography>
                      <MyRadio
                        name="gender"
                        type="radio"
                        value="male"
                        label="Male"
                        onChange={handleChange}
                      />
                      <MyRadio
                        name="gender"
                        type="radio"
                        value="female"
                        label="Female"
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography style={{ color: "blue" }}>
                        Subject Marks
                      </Typography>
                      <TextField
                        name="subject[0]"
                        type="number"
                        onChange={handleChange}
                        label="English"
                        variant="outlined"
                        margin="normal"
                        value={values.subject[0]}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="subject[1]"
                        label="maths"
                        type="number"
                        variant="outlined"
                        onChange={handleChange}
                        margin="normal"
                        value={values.subject[1]}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="subject[2]"
                        id="subject"
                        type="number"
                        label="science"
                        variant="outlined"
                        onChange={handleChange}
                        margin="normal"
                        value={values.subject[2]}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={3}>
                      {clculateTotal(values.subject)}
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                      >
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            />
          </div>
        </Container>
      </Grid>
    </Grid>
  );
};

export default App;
