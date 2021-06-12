import { mock } from "../lib/axios";
import { Student } from "../types/student";


mock.onGet("/api/student").reply(() => {
  // debugger;
  const student: Student = {
    firstName: "abhi",
    lastName: "mishra",
    email: "abmishra700@gmail.com",
    address: "room no 1 Dahisar mumba 400068 ",
    gender: "male",
    subject: [1, 2, 4],
  };

  return [200, { student }];
});

mock.onPost("/api/student").reply((request) => {
  debugger;
  try {
    const { firstName, lastName, email, address, gender, subject } = JSON.parse(
      request.data
    );

    const stud = {
      firstName,
      lastName,
      email,
      address,
      gender,
      subject,
    };

    console.log(stud);
    return [200, { stud }];
  } catch (err) {
    console.error("[Mock]: ", err);
    return [500, { message: "Internal server error" }];
  }
});
