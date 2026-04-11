import { Progress } from "@chakra-ui/react"

const ProcessingBar = () => (
  <Progress.Root width="80px" colorPalette="blue" variant="subtle" value={null}>
    <Progress.Track>
      <Progress.Range />
    </Progress.Track>
  </Progress.Root>
)

export default ProcessingBar
