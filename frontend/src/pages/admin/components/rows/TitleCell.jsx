import { Table } from "@chakra-ui/react"

const TitleCell = ({ children }) => (
  <Table.Cell style={{ textAlign: 'left', paddingLeft: '2rem' }}>
    {children}
  </Table.Cell>
)

export default TitleCell
