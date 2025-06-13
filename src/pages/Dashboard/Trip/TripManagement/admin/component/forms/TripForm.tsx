import {
Box,
Button,
Flex,
Grid,
GridItem,
SimpleGrid,
Text,
} from "@chakra-ui/react";
import { FieldArray, Form, Formik } from "formik";
import { FaPlus, FaTimes } from "react-icons/fa";
import CustomInput from "../../../../../../../config/component/CustomInput/CustomInput";
import CountrySelect from "../../../../../../../config/component/LocationSelector/CountrySelect";
import StateSelect from "../../../../../../../config/component/LocationSelector/StateSelect";
import CitySelect from "../../../../../../../config/component/LocationSelector/CitySelect";
import {
insertUniqueFile,
removeDataByIndex,
} from "../../../../../../../config/constant/function";
import ShowFileUploadFile from "../../../../../../../config/component/common/ShowFileUploadFile/ShowFileUploadFile";
import { categoryTypes, travelModes, tripTypes } from "../../../utils/constant";
import { TripFormI } from "../../../utils/interface";
import tripFormValidation from "../../../utils/validation";
import { generateFormError } from "../../../utils/functions";
import store from "../../../../../../../store/store";
import { useEffect } from "react";
import SubmitFormBtn from "../../../../../../../config/component/Button/SubmitFormBtn";
import NotFoundData from "../../../../../../../config/component/commonPages/NotFoundData";

const AddDetailButton: React.FC<{ title: string; onClick: () => void }> = ({
onClick,
title,
}) => (
<Button
	type="button"
	onClick={onClick}
	leftIcon={<FaPlus />}
	colorScheme="blue"
	variant="solid"
	size="sm"
>
	{title}
</Button>
);

const TripForm = ({
loading,
showError,
setShowError,
onClose,
onSubmit,
initialValues,
thumbnail,
setThumbnail,
isEdit,
isFileDeleted,
setIsFileDeleted,
}: TripFormI) => {
const {
	auth: { getCompanyUsers, openNotification },
} = store;

useEffect(() => {
	getCompanyUsers({ page: 1 })
	.then(() => {})
	.catch((err) => {
		openNotification({
		message: err?.message,
		title: "Fetch Users Failed",
		type: "err",
		});
	});
}, [getCompanyUsers, openNotification]);

const generateErrors = (
	errorType: any,
	errors: any,
	type: string,
	index: number
  ) => {
	if (errorType === "attachment") {
	  const errorTypes = ["title"];
	  if (errors.attach_files && errors.attach_files[index]) {
		const errorTypeIndex = errorTypes.indexOf(type);
		if (errorTypeIndex !== -1) {
		  return errors.attach_files[index][errorTypes[errorTypeIndex]];
		}
	  }
	  return undefined;
	}


	if (errorType === "participants") {
	  const errorTypes = ["user"];
	  if (errors.participants && errors.participants[index]) {
		const errorTypeIndex = errorTypes.indexOf(type);
		if (errorTypeIndex !== -1) {
		  return errors.participants[index][errorTypes[errorTypeIndex]];
		}
	  }
	  return undefined;
	}

  };


return (
	<Box>
	<Formik<any>
		initialValues={initialValues}
		validationSchema={tripFormValidation}
		enableReinitialize={true}
		onSubmit={(values, { resetForm }) => {
		onSubmit(values, resetForm);
		}}
	>
		{({ handleChange, setFieldValue, values, errors }) => {
		return (
			<Form>
			<Box minH={"80vh"} maxH={"80vh"} overflowY={"auto"}>
				<SimpleGrid columns={2} spacing={4}>
				<GridItem colSpan={2}>
					<Flex>
					{thumbnail.length === 0 ? (
						<CustomInput
						type="file-drag"
						name="thumbnail"
						value={thumbnail}
						isMulti={false}
						accept="image/*"
						onChange={(e: any) => {
							insertUniqueFile(
							setThumbnail,
							thumbnail,
							e.target.files
							);
						}}
						/>
					) : (
						<Box mt={-5} width="100%">
						<ShowFileUploadFile
							edit={isEdit}
							files={thumbnail}
							setIsFileDeleted={setIsFileDeleted}
							isFileDeleted={isFileDeleted}
							removeFile={(_: any, index: number) => {
							setThumbnail(removeDataByIndex(thumbnail, index));
							if (isEdit && isFileDeleted === 0) {
								setIsFileDeleted(1);
							}
							}}
						/>
						</Box>
					)}
					</Flex>
				</GridItem>
				</SimpleGrid>
				{/* For the main trip title */}
				<Text fontWeight="bold" mt={3}>
				Trip Details
				</Text>
				<Box
				p={4}
				borderRadius="md"
				borderWidth={3}
				boxShadow="md"
				mt={3}
				pb={8}
				>
				<Grid
					columnGap={4}
					templateColumns={{ base: "1fr", lg: "1fr 1fr 1fr" }}
				>
					<GridItem>
					<CustomInput
						name="title"
						placeholder="Enter the Title"
						label="Title"
						required={true}
						onChange={handleChange}
						value={values.title}
						error={errors.title}
						showError={showError}
					/>
					</GridItem>
					<GridItem>
					<CustomInput
						label="Trip Type"
						required={true}
						type="select"
						name="type"
						value={values.type}
						options={tripTypes}
						onChange={(e: any) => setFieldValue("type", e)}
						showError={showError}
						error={errors.type}
					/>
					</GridItem>
					<GridItem>
					<CountrySelect
						label="Countries"
						showError={showError}
						error={errors.country}
						name={`country`}
						value={values.country}
						onChange={(e) => {
						setFieldValue(`country`, e);
						}}
					/>
					</GridItem>
					<GridItem colSpan={{ base: 1, md: 4 }}>
                      <Box mt={5} mb={2}>
                        <Text fontWeight={"bold"}>Add Participants :- </Text>
                      </Box>
                      <FieldArray name="participants">
                        {({ push, remove }) => (
                          <>
                            {values.participants.length > 0 ? (
                              <Grid
                                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                                gap={4}
                                mb={4}
                              >
                                {values.participants.map(
                                  (user: any, index: number) => (
                                    <Box
                                      key={`participants-${index}-${user}`}
                                      p={4}
                                      borderWidth="1px"
                                      borderRadius="md"
                                      boxShadow="sm"
                                    >
                                      <Flex
                                        direction={{
                                          base: "column",
                                          md: "row",
                                        }}
                                        align="center"
                                        justify="space-between"
                                        gap={4}
                                      >
                                        <CustomInput
                                          name={`participants.${index}.user`}
                                          label="Participants"
                                          value={
                                            isEdit && user?.user
                                              ? {
                                                  label: user.user.username,
                                                  value: user.user._id,
                                                }
                                              : undefined
                                          }
                                          options={
                                            isEdit && user?.user
                                              ? [
                                                  {
                                                    label: user.user.username,
                                                    value: user.user._id,
                                                  },
                                                ]
                                              : []
                                          }
                                          placeholder="Select Participants"
                                          type="real-time-user-search"
                                          onChange={(selectedOption) => {
                                            setFieldValue(
                                              `participants.${index}.user`,
                                              selectedOption
                                            );
                                          }}
                                          isMulti={false}
                                          isSearchable
                                          showError={true}
                                          error={generateErrors(
                                            "participants",
                                            errors,
                                            "user",
                                            index
                                          )}
                                          rest={{ flex: 1 }}
                                        />
                                        <CustomInput
                                          type="checkbox"
                                          name={`participants.${index}.isActive`}
                                          label="Active"
                                          value={user.isActive}
                                          onChange={(e: any) => {
                                            setFieldValue(
                                              `participants.${index}.isActive`,
                                              e.target.checked
                                            );
                                          }}
                                          rest={{ flexShrink: 0 }}
                                        />
                                        <Button
                                          onClick={() => {
                                            remove(index);
                                          }}
                                          size="sm"
                                          colorScheme="red"
                                          variant="outline"
                                          flexShrink={0}
                                        >
                                          Delete
                                        </Button>
                                      </Flex>
                                    </Box>
                                  )
                                )}
                              </Grid>
                            ) : (
                              <Text
                                fontSize="md"
                                color="gray.500"
                                mb={4}
                                textAlign="center"
                                fontWeight="bold"
                              >
                                No Participants added yet.
                              </Text>
                            )}
                            {((values.type?.value === "individual" && values.participants?.length < 1) || values.type?.value === "group") && <Button
                              mt={4}
                              width="100%"
                              onClick={() =>
                                push({
                                  user: undefined,
                                  isActive: true,
                                  isAdd: true
                                })
                              }
                              colorScheme="blue"
                            >
                              Add Participants
                            </Button>}
                          </>
                        )}
                      </FieldArray>
                    </GridItem>
				</Grid>
				</Box>
				{/* for the travels details */}
				<Box mt={4}>
				<Flex alignItems="center">
					<Box flexGrow={1}>
					<strong>Travel Details</strong>
					</Box>
					<AddDetailButton
					title="Add Travel Details"
					onClick={() => {
						setFieldValue("travelDetails", [
						...values.travelDetails,
						{
							fromState: "",
							toState: "",
							fromCity: "",
							toCity: "",
							locality: "",
							startDate: new Date(),
							endDate: new Date(),
							isCab: false,
							travelMode: "",
							travelCost: "",
							cabCost: "",
						},
						]);
					}}
					/>
				</Flex>
				<FieldArray name="travelDetails">
					{({ remove }) => (
					<Grid>
						{values.travelDetails.map((travel: any, index: any) => (
						<Box
							key={index}
							p={4}
							borderRadius="md"
							borderWidth={3}
							boxShadow="md"
							mt={3}
						>
							<Grid
							templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
							gap={2}
							columnGap={4}
							>
							<Box>
								<Text fontWeight="bold">From</Text>
								<Grid
								templateColumns={{ base: "1fr 1fr" }}
								gap={2}
								>
								<StateSelect
									name={`travelDetails[${index}].fromState`}
									country={values.country}
									label="State"
									onChange={(e: any) => {
									setFieldValue(
										`travelDetails[${index}].fromState`,
										e
									);
									setFieldValue(
										`travelDetails[${index}].fromCity`,
										""
									);
									}}
									value={travel.fromState}
								/>
								<CitySelect
									country={values.country}
									state={travel.fromState}
									name={`travelDetails[${index}].fromCity`}
									label="City"
									onChange={(e: any) =>
									setFieldValue(
										`travelDetails[${index}].fromCity`,
										e
									)
									}
									value={travel.fromCity}
								/>
								</Grid>
							</Box>
							<Box>
								<Text fontWeight="bold">To</Text>
								<Grid
								templateColumns={{ base: "1fr 1fr" }}
								gap={2}
								>
								<StateSelect
									name={`travelDetails[${index}].toState`}
									country={values.country}
									label="State"
									onChange={(e: any) => {
									setFieldValue(
										`travelDetails[${index}].toState`,
										e
									);
									setFieldValue(
										`travelDetails[${index}].toCity`,
										""
									);
									}}
									value={travel.toState}
								/>
								<CitySelect
									country={values.country}
									state={travel.toState}
									name={`travelDetails[${index}].toCity`}
									label="City"
									onChange={(e: any) =>
									setFieldValue(
										`travelDetails[${index}].toCity`,
										e
									)
									}
									value={travel.toCity}
								/>
								</Grid>
							</Box>
							</Grid>
							<Grid
							templateColumns="repeat(2, 1fr)"
							gap={4}
							mt={2}
							>
							<CustomInput
								type="date"
								name={`travelDetails[${index}].startDate`}
								placeholder="Start Date"
								label="Start Date"
								required={true}
								onChange={(e: any) => {
								setFieldValue(
									`travelDetails[${index}].startDate`,
									e
								);
								}}
								value={travel.startDate}
								showError={showError}
								error={generateFormError(
								errors,
								"travelDetails",
								"startDate",
								index
								)}
							/>
							<CustomInput
								type="date"
								name={`travelDetails[${index}].endDate`}
								placeholder="End Date"
								label="End Date"
								required={true}
								onChange={(e: any) => {
								setFieldValue(
									`travelDetails[${index}].endDate`,
									e
								);
								}}
								minDate={travel.startDate}
								value={travel.endDate}
								showError={showError}
								error={generateFormError(
								errors,
								"travelDetails",
								"endDate",
								index
								)}
							/>
							</Grid>
							<Grid
							templateColumns="repeat(2, 1fr)"
							gap={4}
							mt={2}
							>
							<CustomInput
								name={`travelDetails[${index}].travelMode`}
								value={travel.travelMode}
								type="select"
								options={travelModes}
								onChange={(e) => {
								setFieldValue(
									`travelDetails[${index}].travelMode`,
									e
								);
								}}
								label="Travel Mode"
								showError={showError}
								error={generateFormError(
								errors,
								"travelDetails",
								"travelMode",
								index
								)}
							/>
							{travel.travelMode && (
								<CustomInput
								label="Amount"
								type="number"
								name={`travelDetails[${index}].travelCost`}
								onChange={handleChange}
								value={travel.travelCost}
								showError={showError}
								error={generateFormError(
									errors,
									"travelDetails",
									"travelCost",
									index
								)}
								/>
							)}
							</Grid>
							{travel.travelCost && (
							<Grid
								templateColumns="repeat(2, 1fr)"
								gap={4}
								mt={2}
							>
								<CustomInput
								name={`travelDetails[${index}].isCab`}
								type="radio"
								label="Do you need a Cab?"
								options={[
									{ value: "true", label: "Yes" },
									{ value: "false", label: "No" },
								]}
								value={travel.isCab}
								onChange={(e) =>
									setFieldValue(
									`travelDetails[${index}].isCab`,
									e
									)
								}
								/>
								{travel.isCab === "true" && (
								<CustomInput
									label="Amount"
									type="number"
									placeholder="Enter the cab amount"
									name={`travelDetails[${index}].cabCost`}
									onChange={handleChange}
									value={travel.cabCost}
									showError={showError}
									error={generateFormError(
									errors,
									"travelDetails",
									"cabCost",
									index
									)}
								/>
								)}
							</Grid>
							)}
							{travel.travelCost && (
							<Grid
								// templateColumns="repeat(2, 1fr)"
								gap={4}
								mt={2}
							>
								<CustomInput
								name={`travelDetails[${index}].isAccommodation`}
								type="radio"
								label="Do you need Accommodation?"
								options={[
									{ value: "true", label: "Yes" },
									{ value: "false", label: "No" },
								]}
								value={travel.isAccommodation}
								onChange={(e) =>
									setFieldValue(
									`travelDetails[${index}].isAccommodation`,
									e
									)
								}
								/>
								{travel.isAccommodation === "true" && (
								<Grid
									templateColumns={{
									base: "1fr",
									sm: "repeat(3, 1fr)",
									}}
									gap={4}
								>
									<CustomInput
									type="text"
									name={`travelDetails[${index}].locality`}
									placeholder="Locality"
									label="Locality"
									required={true}
									onChange={handleChange}
									value={travel.locality}
									showError={showError}
									error={generateFormError(
										errors,
										"travelDetails",
										"locality",
										index
									)}
									/>
									<CustomInput
									type="number"
									name={`travelDetails[${index}].durationOfStay`}
									placeholder="No. of Days for Stays"
									label="No. Of Days For Stays"
									required={true}
									onChange={handleChange}
									value={travel.durationOfStay}
									showError={showError}
									error={generateFormError(
										errors,
										"travelDetails",
										"durationOfStay",
										index
									)}
									/>
									<CustomInput
									type="number"
									name={`travelDetails[${index}].accommodationCost`}
									placeholder="Accommodation Total Cost"
									label="Accommodation Total Cost"
									required={true}
									onChange={handleChange}
									value={travel.accommodationCost}
									showError={showError}
									error={generateFormError(
										errors,
										"travelDetails",
										"accommodationCost",
										index
									)}
									/>
								</Grid>
								)}
							</Grid>
							)}
							<Button
							type="button"
							mt={4}
							onClick={() => remove(index)}
							leftIcon={<FaTimes />}
							colorScheme="red"
							variant="outline"
							size="sm"
							>
							Remove
							</Button>
						</Box>
						))}
					</Grid>
					)}
				</FieldArray>
				</Box>
				{/* For the additional expenses */}
				<Grid mt={4}>
				<Flex justifyContent="space-between" alignItems="center">
					<Text fontWeight="bold">Additional Expenses</Text>
					<AddDetailButton
					title="Add Expenses"
					onClick={() => {
						setFieldValue("additionalExpenses", [
						...values.additionalExpenses,
						{
							type: "",
							amount: "",
						},
						]);
					}}
					/>
				</Flex>
				<FieldArray name="additionalExpenses">
					{({ remove }) => (
					<Grid>
						{values.additionalExpenses.map(
						(addition: any, index: any) => (
							<Box
							key={index}
							p={4}
							borderRadius="md"
							borderWidth={3}
							boxShadow="md"
							mt={3}
							>
							<Grid
								templateColumns={{ base: "1fr", sm: "1fr 1fr" }}
								columnGap={4}
							>
								<CustomInput
								label="Trip Type"
								required={true}
								type="select"
								name="type"
								value={addition.type}
								options={categoryTypes}
								onChange={(e: any) =>
									setFieldValue(
									`additionalExpenses[${index}].type`,
									e
									)
								}
								/>
								<CustomInput
								type="number"
								name={`additionalExpenses[${index}].amount`}
								value={addition.amount}
								placeholder="Amount"
								label="Amount"
								onChange={handleChange}
								/>
							</Grid>
							<Button
								type="button"
								mt={4}
								onClick={() => remove(index)}
								leftIcon={<FaTimes />}
								colorScheme="red"
								variant="outline"
								size="sm"
							>
								Remove
							</Button>
							</Box>
						)
						)}
					</Grid>
					)}
				</FieldArray>
				</Grid>
				<GridItem colSpan={2}>
				<CustomInput
					type="textarea"
					name="description"
					placeholder="Enter the Description"
					label="Description"
					required={true}
					onChange={handleChange}
					value={values.description}
				/>
				</GridItem>
				<Box>
                    <Box mt={5} mb={2}>
                      <Text fontWeight={"bold"}>Add Attachments :- </Text>
                    </Box>
                    <Box>
                      {values.attach_files?.length === 0 ? (
                        <Box>
                          <NotFoundData
                            title="No Attachment Are Found"
                            subTitle="Add New Attachment for the project description"
                            btnText="Add New Attachment"
                            onClick={() => {
                              setFieldValue("attach_files", [
                                {
                                  title: "",
                                  description: "",
                                  file: null,
                                  isAdd : 1
                                },
                              ]);
                            }}
                          />
                        </Box>
                      ) : (
                        <Grid columnGap={5} rowGap={3} mb={5}>
                          <FieldArray name="attach_files">
                            {({ push, remove }) => (
                              <Box>
                                {values.attach_files.map(
                                  (file: any, index: number) => {
                                    return (
                                      <Box key={index} mb="20px">
                                        <Grid
                                          gridTemplateColumns={{ md: "1fr" }}
                                          gap={2}
                                        >
                                          <Box width="100%">
                                            {file.file ? (
                                              <ShowFileUploadFile
                                                edit={isEdit}
                                                files={file.file[0]}
                                                removeFile={() => {
                                                  if(isEdit === true)
                                                  {
                                                    setFieldValue('deleteAttachments', [...values.deleteAttachments,file.file[0]?.name])
                                                  }
                                                  const updatedFiles =
                                                    values.attach_files.map(
                                                      (item: any, i: number) =>
                                                        i === index
                                                          ? {
                                                              ...item,
                                                              file: null,
                                                              isDeleted: 1,
                                                              isAdd: 0,
                                                              index : index
                                                            }
                                                          : item
                                                    );
                                                  setFieldValue(
                                                    "attach_files",
                                                    updatedFiles
                                                  );
                                                }}
                                                // Optionally, you can add functionality to remove files
                                              />
                                            ) : (
                                              <CustomInput
                                                name={`attach_files.${index}.file`}
                                                type="file-drag"
                                                placeholder="File"
                                                label="File"
                                                required
                                                showError={showError}
                                                onChange={(e: any) => {
                                                  setFieldValue(
                                                    `attach_files.${index}.file`,
                                                    e.target.files
                                                  );
                                                  setFieldValue(
                                                    `attach_files.${index}.isAdd`,
                                                    1
                                                  );
                                                }}
                                              />
                                            )}
                                          </Box>
                                          <CustomInput
                                            name={`attach_files.${index}.title`}
                                            type="text"
                                            placeholder="Title"
                                            label="Title"
                                            value={file.title}
                                            required
                                            showError={showError}
                                            onChange={handleChange}
                                            error={generateErrors(
                                              "attachment",
                                              errors,
                                              "title",
                                              index
                                            )}
                                          />
                                          <CustomInput
                                            name={`attach_files.${index}.description`}
                                            type="textarea"
                                            placeholder="Description"
                                            label="Description"
                                            value={file.description}
                                            showError={showError}
                                            onChange={handleChange}
                                          />
                                        </Grid>
                                        {values.attach_files.length && (
                                          <Button
                                            colorScheme="red"
                                            variant="outline"
                                            size="sm"
                                            mt="10px"
                                            onClick={
                                              () => {
                                                if(isEdit === true)
                                                  {
                                                    setFieldValue('deleteAttachments', [...values.deleteAttachments,file.file[0]?.name])
                                                  }
                                                remove(index)
                                              }
                                            }
                                          >
                                            Remove Section
                                          </Button>
                                        )}
                                      </Box>
                                    );
                                  }
                                )}
                                <Button
                                  colorScheme="blue"
                                  variant="outline"
                                  display="block"
                                  size="sm"
                                  mb="10px"
                                  mt={5}
                                  onClick={() =>
                                    push({
                                      title: "",
                                      description: "",
                                      file: null,
                                      isAdd:1
                                    })
                                  }
                                >
                                  Add Section
                                </Button>
                              </Box>
                            )}
                          </FieldArray>
                        </Grid>
                      )}
                    </Box>
                  </Box>
			</Box>
			<SubmitFormBtn
				onClick={() => setShowError(true)}
				buttonText="Submit"
				loading={loading}
				cancelFunctionality={{
				show: true,
				text: "Cancel",
				onClick: () => onClose(),
				}}
			/>
			</Form>
		);
		}}
	</Formik>
	</Box>
);
};

export default TripForm;