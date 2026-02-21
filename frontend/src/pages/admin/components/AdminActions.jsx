import React from 'react';
import * as Config from "config/index.jsx";
import { AdminActionButton } from 'components/Buttons.jsx';

export default function AdminActions({ handleClick, handleEditEvents, handleDeleteEvents }) {
  return (
    <div style={{ display: Config.FLEX, justifyContent: Config.CENTER, gap: '1rem', marginTop: '1rem', color: Config.WHITE, fontWeight: Config.BOLD }}>
      <AdminActionButton onClick={ handleClick(Config.ADD, undefined) } text="Add"></AdminActionButton>
      <AdminActionButton onClick={ handleEditEvents } text="Edit"></AdminActionButton>
      <AdminActionButton onClick={ handleDeleteEvents } text="Delete"></AdminActionButton>
    </div>
  );
}
