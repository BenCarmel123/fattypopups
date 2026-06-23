import { Progress } from "@chakra-ui/react"
import * as Config from 'config/index.jsx';

const ProcessingBar = () => (
  <Progress.Root width="80px" colorPalette="blue" variant={Config.SUBTLE} value={null}>
    <Progress.Track>
      <Progress.Range />
    </Progress.Track>
  </Progress.Root>
)

export default ProcessingBar
