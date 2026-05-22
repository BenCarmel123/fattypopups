const TitleContent = ({ title, isDraft }) => (
  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
    {isDraft && <span style={{ color: 'gray', fontStyle: 'italic', fontSize: '0.85em', flexShrink: 0 }}>(draft)</span>}
  </span>
)

export default TitleContent
