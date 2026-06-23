import * as Config from 'config/index.jsx';

const TitleContent = ({ title, isDraft }) => (
  <span style={{ display: Config.FLEX, alignItems: Config.CENTER, gap: '0.25rem' }}>
    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: Config.NOWRAP }}>{title}</span>
    {isDraft && <span style={{ color: 'gray', fontStyle: 'italic', fontSize: '0.85em', flexShrink: 0 }}>(draft)</span>}
  </span>
)

export default TitleContent
