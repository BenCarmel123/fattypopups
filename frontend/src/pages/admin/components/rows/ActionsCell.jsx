import { Table } from "@chakra-ui/react"
import * as Config from 'config/index.jsx'

const ActionsCell = ({ children }) => (
  <Table.Cell style={{ textAlign: 'right', display: Config.FLEX, gap: '1rem', alignItems: Config.CENTER, justifyContent: 'flex-end', paddingRight: '2rem' }}>
    {children}
  </Table.Cell>
)

export default ActionsCell
