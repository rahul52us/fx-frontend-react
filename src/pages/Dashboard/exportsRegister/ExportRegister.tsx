import { Box } from '@chakra-ui/react'
import ExportRegisterTable from './component/ExportRegisterTable/ExportRegsiterTable'
import DashPageHeader from '../../../config/component/common/DashPageHeader/DashPageHeader'
import DashPageTitle from '../../../config/component/common/DashPageTitle/DashPageTitle'

const ExportRegister = () => {
  return (
    <Box p={{base : 2, md : 8}}>
      <Box display="none">
        <DashPageHeader
          breadcrumb={[]}
        />
      </Box>
      <DashPageTitle
        title="Export Registrations"
        subTitle="Export Registrations Details"
      />
      <Box>
        <ExportRegisterTable
        />
      </Box>
    </Box>
   )
}
export default ExportRegister