import { Spinner } from "@chakra-ui/react"
import { primaryColor } from "../../../globalColors"

const NormalLoader = ({size} : any) => {
  return (
    <Spinner size={size} color={primaryColor}/>
  )
}

export default NormalLoader