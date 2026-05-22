import { Table } from "@chakra-ui/react"
import { useState } from "react"
import * as Config from 'config/index.jsx'
import MyAlert from "../components/CustomAlert.jsx";
import AdminActions from "../components/AdminActions.jsx";
import { deleteEvent } from "controller/events.js";
import SpinnerOverlay from "../components/SpinnerOverlay.jsx";
import { logger } from "utils/logger.js";
import EventRow from "../components/rows/EventRow.jsx";

const Dashboard = ({ handleClick, events, setEvents, onRetry }) => {
  const [alert, setAlert] = useState(undefined);
  const [deleting, setDeleting] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleDeleteSingle = (id, title) => {
    setDeleting(true);
    deleteEvent(id)
      .then(() => {
        setEvents(prev => {
          const updated = prev.filter(ev => ev.id !== id);
          sessionStorage.setItem('admin_events', JSON.stringify(updated));
          return updated;
        });
        setAlert({ status: Config.STATUS_SUCCESS, description: `"${title}" was deleted.` });
      })
      .catch(err => logger.error('Error deleting event:', err))
      .finally(() => setDeleting(false));
  };

  const eventRows = events.map((event) => (
    <EventRow
      key={event.title}
      event={event}
      hoveredIcon={hoveredIcon}
      setHoveredIcon={setHoveredIcon}
      onDelete={() => handleDeleteSingle(event.id, event.title)}
      onEdit={() => handleClick(Config.EDIT, event)()}
      onRetry={() => onRetry(event.id, event.title)}
    />
  ));

  return (
    <div className={Config.CENTER} style={{ position: Config.RELATIVE, display: Config.FLEX, alignItems: Config.CENTER, justifyContent: Config.CENTER, minHeight: '100vh', paddingTop: '3rem' }}>
    <div style={{ display: Config.FLEX, flexDirection: 'column', alignItems: 'stretch', maxWidth: '1200px', width: '100%', padding: '1rem', borderRadius: '2rem', overflow: 'hidden' }}>
      <SpinnerOverlay isLoading={deleting} />
      {alert && <MyAlert {...alert} onClose={() => setAlert(null)} />}
      <Table.Root size={Config.LARGE} marginTop="2rem" style={{ tableLayout: 'fixed', width: '100%' }}>
        <Table.Header>
          <Table.Row style={{ backgroundColor: Config.ADMIN_TABLE_HEADER_COLOR, fontSize: '1.25rem', height: '3.5rem' }}>
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
