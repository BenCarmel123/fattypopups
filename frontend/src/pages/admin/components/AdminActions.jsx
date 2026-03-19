import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Config from "config/index.jsx";
import { AdminActionButton, BackButton } from 'components/Buttons.jsx';

export default function AdminActions({ handleClick }) {
  const navigate = useNavigate();

  return (
    <div style={{ display: Config.FLEX, justifyContent: Config.CENTER, gap: '1rem', marginTop: '1rem', color: Config.WHITE, fontWeight: Config.BOLD, alignItems: Config.CENTER }}>
      <BackButton homepage onBack={() => navigate('/')} />
      <AdminActionButton onClick={ handleClick(Config.ADD, undefined) } text="Manual Form"></AdminActionButton>
      <AdminActionButton onClick={ handleClick(Config.AI, undefined) } text="AI Form"></AdminActionButton>
    </div>
  );
}
