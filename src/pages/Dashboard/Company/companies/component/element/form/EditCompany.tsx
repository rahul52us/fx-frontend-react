import { observer } from "mobx-react-lite"
import FormCompany from "./FormCompany"

const EditCompany = observer(({onClose, data} : any) => {
  return (
    <FormCompany initialValues={data} onClose={onClose} isEdit={true}/>
  )
})

export default EditCompany