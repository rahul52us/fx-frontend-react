import { dashboard } from "../../../config/constant/routes";

const videoBreadCrumb = [
  { label: "Home", link: "/" },
  { label: "Dashboard", link: dashboard.home },
  { label: "Videos" },
];

const quizBreadCrumb = [
  { label: "Home", link: "/" },
  { label: "Dashboard", link: dashboard.home },
  { label: "Quiz" },
];

const dashBreadCrumb = [{ label: "Home", link: "/" }, { label: "Dashboard" }];

const coursesBreadCrumb = [
  { label: "Home", link: "/" },
  { label: "Dashboard", link: dashboard.home },
  { label: "Courses" },
];

const projectBreadCrumb = {
  index: [
    { label: "Home", link: "/" },
    { label: "Dashboard", link: dashboard.home },
    { label: "project" },
  ],
  task : {
    index: [
      { label: "Home", link: "/" },
      { label: "Dashboard", link: dashboard.home },
      { label: "Project", link: dashboard.project.index },
      { label: "Task" },
    ],
  }
};

const dashProfileBreadCrumb = {
  index: [
    { label: "Home", link: "/" },
    { label: "Dashboard", link: dashboard.home },
    { label: "Profile" },
  ]
};

const UsersBreadCrumb = {
  index: [
    { label: "Home", link: "/" },
    { label: "Dashboard", link: dashboard.home },
    { label: "Users" },
  ],
  details: [
    { label: "Home", link: "/" },
    { label: "Users", link: dashboard.Users.index },
    { label: "Details" },
  ],
  new: [
    { label: "Home", link: "/" },
    { label: "Users", link: dashboard.Users.details },
    { label: "New" },
  ],
  personalDetails: [
    { label: "Home", link: "/" },
    { label: "Dashboard", link: dashboard.home },
    { label: "Details" },
  ],
};

const tripBreadCrumb = {
  index : [
  { label: "Home", link: "/" },
  { label: "Dashboard", link: dashboard.home },
  { label: "Trip" }],
  individualTrip : [
    { label: "Home", link: "/" },
    { label: "Trip", link: dashboard.tripManagement.index },
    { label: "Individual" }],
  users : [
    { label: "Home", link: dashboard.home },
    { label: "Trip", link: dashboard.tripManagement.index },
    { label: "Users" }]
}

const blogBreadCrumb = {
  index : [
  { label: "Home", link: "/" },
  { label: "Dashboard", link: dashboard.home },
  { label: "Blog" }]
}

const departmentsBreadCrumb = [
  { label: "Home", link: "/" },
  { label: "Company", link: dashboard.company.index },
  { label: "Departments" },
];

const companyBreadCrumb = {
  index: [
    { label: "Home", link: "/" },
    { label: "Dashboard", link: dashboard.home },
    { label: "Company" },
  ],
  policy: [
    { label: "Home", link: "/" },
    { label: "Company", link: dashboard.company.index },
    { label: "Policy" },
  ],
};

const requestBreadCrumb = {
  userIndex: [
    { label: "Home", link: "/" },
    { label: "User List", link: dashboard.request.userList },
    { label: "Request" },
  ],
  userList: [
    { label: "Home", link: "/" },
    { label: "Dashboard", link: dashboard.home },
    { label: "User List" },
  ],
  index: [
    { label: "Home", link: "/" },
    { label: "Dashboard", link: dashboard.home },
    { label: "Request" },
  ],
  leave: [
    { label: "Home", link: "/" },
    { label: "Request", link: dashboard.request.index },
    { label: "Leave" },
  ],
};

const attendenceBreadCrumb = {
  attendence: [
    { label: "Home", link: "/" },
    { label: "Dashboard", link: dashboard.home },
    { label: "Attendence" },
  ],
  userList: [
    { label: "Home", link: "/" },
    { label: "Dashboard", link: dashboard.home },
    { label: "User List" },
  ],
};


const liberaryBreadCrumb = {
  liberary: [
    { label: "Home", link: "/" },
    { label: "Dashboard", link: dashboard.home },
    { label: "Liberay" },
  ]
};

const booksBreadCrumb = {
  index: [
    { label: "Home", link: "/" },
    { label: "Dashboard", link: dashboard.home },
    { label: "Books" },
  ],
  category : [
    { label: "Home", link: "/" },
    { label: "Dashboard", link: dashboard.home },
    { label: "Books Category" },
  ]
};

export {
  videoBreadCrumb,
  coursesBreadCrumb,
  quizBreadCrumb,
  dashBreadCrumb,
  tripBreadCrumb,
  UsersBreadCrumb,
  departmentsBreadCrumb,
  companyBreadCrumb,
  requestBreadCrumb,
  attendenceBreadCrumb,
  projectBreadCrumb,
  liberaryBreadCrumb,
  dashProfileBreadCrumb,
  booksBreadCrumb,
  blogBreadCrumb
};
