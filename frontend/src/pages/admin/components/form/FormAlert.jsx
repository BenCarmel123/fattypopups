import * as Config from 'config/index.jsx';
import MyAlert from "components/CustomAlert.jsx";

// Reusable fixed alert overlay component
export default function FormAlert({ alert, onClose }) {
  if (!alert) return null;
  return (
    <div style={{ 
      position: Config.FIXED, 
      top: 0, 
      left: 0, 
      width: Config.MAX, 
      zIndex: 2000, 
      display: Config.FLEX, 
      justifyContent: Config.CENTER, 
      pointerEvents: 'none' 
    }}>
      <div style={{ pointerEvents: Config.AUTO, width: 'fit-content' }}>
        <MyAlert {...alert} onClose={onClose} />
      </div>
    </div>
  );
}
