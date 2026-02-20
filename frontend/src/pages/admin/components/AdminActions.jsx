import { ADD, FLEX, CENTER, BOLD } from "config/strings.jsx";
import { WHITE } from "config/colors.jsx";
import React from 'react';
import { AdminActionButton } from 'components/Buttons.jsx';

export default function AdminActions({ handleClick, handleEditEvents, handleDeleteEvents }) {
  return (
    <div style={{ display: FLEX, justifyContent: CENTER, gap: '1rem', marginTop: '1rem', color: WHITE, fontWeight: BOLD }}>
      <AdminActionButton onClick={ handleClick(ADD, undefined) } text="Add"></AdminActionButton>
      <AdminActionButton onClick={ handleEditEvents } text="Edit"></AdminActionButton>
      <AdminActionButton onClick={ handleDeleteEvents } text="Delete"></AdminActionButton>
    </div>
  );
}
