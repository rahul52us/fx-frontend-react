import * as Yup from 'yup';

export interface AdditionalExpense {
  type: { label: string, value: string } | string;
  amount: string;
}

export interface TravelDetails {
  fromState: string;
  toState: string;
  fromCity: string;
  toCity: string;
  startDate: Date;
  endDate: Date;
  travelMode: { label: string, value: string };
  travelCost: string;
  isCab: boolean;
  cabCost?: string;
  isAccommodation: boolean;
  locality?: string;
  durationOfStay?: number;
  accommodationCost?: number;
}

export interface TripFormValues {
  title: string;
  description: string;
  thumbnail: any;
  country: string;
  type: { label: string, value: string };
  travelDetails: TravelDetails[];
  additionalExpenses: AdditionalExpense[];
  participants: { label: string, value: string }[];
}

const UservalidationSchema = Yup.object().shape({
  user: Yup.mixed()
    .required("Please select a user from the list"),
  isActive: Yup.boolean(),
});

const tripFormValidation: any = Yup.object().shape({
  title: Yup.string().min(3,'Title must be of 3 characters').trim().required('Title is required'),
  description: Yup.string().trim().required('Description is required'),
  country: Yup.string().required('Country is required'),
  participants: Yup.array()
  .of(UservalidationSchema),
    travelDetails: Yup.array().of(
    Yup.object().shape({
      fromState: Yup.string().required('From State is required'),
      toState: Yup.string().required('To State is required'),
      fromCity: Yup.string().required('From City is required'),
      toCity: Yup.string().required('To City is required'),
      startDate: Yup.date().required('Start Date is required'),
      endDate: Yup.date().required('End Date is required'),
      locality: Yup.string().when('isAccommodation', {
        is: (isAccommodation : any) => isAccommodation === "true",
        then: () => Yup.string().required('locality is required'),
     }),
     durationOfStay: Yup.string().when('isAccommodation', {
        is: (isAccommodation : any) => isAccommodation === "true",
        then: () => Yup.number().required('Days of duration is required'),
     }),
     accommodationCost: Yup.string().when('isAccommodation', {
        is: (isAccommodation : any) => isAccommodation === "true",
        then: () => Yup.number().required('accomdation is required'),
     }),
      isCab:Yup.string(),
      cabCost: Yup.string().when('isCab', {
        is: (isCab : any) => isCab === "true",
        then: () => Yup.string().required('Cab Cost is required when Cab is available'),
    }),
    })
  ),
  additionalExpenses: Yup.array().of(
    Yup.object().shape({
      type: Yup.object().shape({
        label: Yup.string().required('Expense Type label is required'),
        value: Yup.string().required('Expense Type value is required'),
      }).required('category type is required'),
      amount: Yup.string().required('Expense Amount is required'),
    })
  ),
  type: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string()
  }).required('Trip type is required'),
});

export default tripFormValidation;
