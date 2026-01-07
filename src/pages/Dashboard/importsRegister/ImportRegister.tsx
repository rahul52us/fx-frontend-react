import { Box } from '@chakra-ui/react'
import ExportRegisterTable from './component/ImportRegisterTable/ImportRegsiterTable'
import DashPageTitle from '../../../config/component/common/DashPageTitle/DashPageTitle'
import DashPageHeader from '../../../config/component/common/DashPageHeader/DashPageHeader'

const ImportRegister = () => {
  return (
    <Box p={{base : 2, md : 4}}>
      <Box display="none">
        <DashPageHeader
          breadcrumb={[]}
        />
      </Box>
      <DashPageTitle
        title="Import Registrations"
        subTitle="Import Registrations Details"
      />
      <Box>
        <ExportRegisterTable
        />
      </Box>
    </Box>
   )
}
export default ImportRegister