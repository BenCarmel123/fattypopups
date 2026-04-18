import { Table } from "@chakra-ui/react"
import { useState } from "react"
import * as Config from 'config/index.jsx'
import MyAlert from "../components/CustomAlert.jsx";
import AdminActions from "../components/AdminActions.jsx";
import { deleteEvents } from "controller/events.js";
import { FaTrash, FaPen } from "config/index.jsx";
import SpinnerOverlay from "../components/SpinnerOverlay.jsx";
import { logger } from "utils/logger.js";
import ProcessingBar from "../components/draft/ProcessingBar.jsx";

const Dashboard = ({ handleClick, events, setEvents }) => {
  const [alert, setAlert] = useState(undefined);
  const [deleting, setDeleting] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleDeleteSingle = (title) => {
    setDeleting(true);
    deleteEvents([title])
      .then(data => {
        setEvents(prev => {
          const updated = prev.filter(ev => !data.deleted.includes(ev.title));
          sessionStorage.setItem('admin_events', JSON.stringify(updated));
          return updated;
        });
        setAlert({ status: Config.STATUS_SUCCESS, description: `"${title}" was deleted.` });
      })
      .catch(err => logger.error('Error deleting event:', err))
      .finally(() => setDeleting(false));
  };

  const eventRows = events.map((event) =>
    (
    <Table.Row key={event.title}>
      <Table.Cell style={{ textAlign: 'left', paddingLeft: '2rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</span>
          {event.is_draft && <span style={{ color: 'gray', fontStyle: 'italic', fontSize: '0.85em', flexShrink: 0 }}>(draft)</span>}
        </span>
      </Table.Cell>
      <Table.Cell style={{ textAlign: 'right', display: Config.FLEX, gap: '1rem', alignItems: Config.CENTER, justifyContent: 'flex-end', paddingRight: '2rem' }}>
        {event.status === 'processing' && <ProcessingBar />}
        <FaPen
          style={{ cursor: Config.POINTER, color: hoveredIcon === `edit-${event.title}` ? Config.ADMIN_PANEL_COLOR : 'gray', transition: 'color 0.2s' }}
          onMouseEnter={() => setHoveredIcon(`edit-${event.title}`)}
          onMouseLeave={() => setHoveredIcon(null)}
          onClick={() => handleClick(Config.EDIT, event)()}
        />
        <FaTrash
          style={{ cursor: Config.POINTER, color: hoveredIcon === `delete-${event.title}` ? Config.DANGER_HOVER_COLOR : 'gray', transition: 'color 0.2s' }}
          onMouseEnter={() => setHoveredIcon(`delete-${event.title}`)}
          onMouseLeave={() => setHoveredIcon(null)}
          onClick={() => handleDeleteSingle(event.title)}
        />
      </Table.Cell>
    </Table.Row>
    )  );

  return (
    <div className={Config.CENTER} style={{ position: Config.RELATIVE, display: Config.FLEX, alignItems: Config.CENTER, justifyContent: Config.CENTER, minHeight: '100vh', paddingTop: '3rem' }}>
    <div style={{ display: Config.FLEX, flexDirection: 'column', alignItems: 'stretch', maxWidth: '1200px', width: '100%', padding: '1rem', borderRadius: '2rem', overflow: 'hidden' }}>
      <SpinnerOverlay isLoading={deleting} />
      {alert && <MyAlert {...alert} onClose={() => setAlert(null)} />}
      <Table.Root size={Config.LARGE} marginTop="2rem" style={{ tableLayout: 'fixed', width: '100%' }}>
        <Table.Header>
          <Table.Row style={{ backgroundColor: Config.BACKGROUND_COLOR, fontSize: '1.25rem', height: '3.5rem' }}>
            <Table.ColumnHeader style={{ width: '70%' }} />
            <Table.ColumnHeader style={{ width: '30%' }} />
          </Table.Row>
        </Table.Header>
        <Table.Body>{eventRows}</Table.Body>
      </Table.Root>
      <AdminActions handleClick={handleClick} />
    </div>
    </div>
  )
}

export default Dashboard
