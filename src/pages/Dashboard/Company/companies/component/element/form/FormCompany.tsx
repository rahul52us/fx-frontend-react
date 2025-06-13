import { Box } from "@chakra-ui/react"
import CreateOrganisationStep2 from "../../../../../../Authentication/CreateOrganisation/createOrganisationStep2/CreateOrganisationStep2"
import { observer } from "mobx-react-lite"

const FormCompany = observer(({onClose, initialValues, isEdit}: any) => {

  const generateIntialValues = (initialValues: any) => {
    if (initialValues && initialValues.activeUser && initialValues.activeUser.length > 0) {
      const activeUser = initialValues.activeUser[0];
      const nameParts = activeUser.name ? activeUser.name.split(' ') : ['', ''];
      return {
        ...initialValues,
        isLogoEdit : false,
        deletedLogo : [],
        first_name: nameParts[0] || '',
        last_name: nameParts[1] || '',
        username: activeUser.username || '',
        code: activeUser.code || ''
      }
    } else {
      return initialValues;
    }
  }

  return (
    <Box>
      <CreateOrganisationStep2
        initialValues={generateIntialValues(initialValues)}
        isEdit={isEdit}
        singleCompany={true}
        onClose={onClose}
      />
    </Box>
  )
})

export default FormCompany;
