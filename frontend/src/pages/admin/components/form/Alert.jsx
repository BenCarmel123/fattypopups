import { FIXED, MAX, FLEX, CENTER, AUTO } from "../../../../config/index.jsx";
import MyAlert from "../../../../components/CustomAlert.jsx";

// Reusable fixed alert overlay component
export default function FormAlert({ alert, onClose }) {
  if (!alert) return null;

  return (
    <div style={{ 
      position: FIXED, 
      top: 0, 
      left: 0, 
      width: MAX, 
      zIndex: 2000, 
      display: FLEX, 
      justifyContent: CENTER, 
      pointerEvents: 'none' 
    }}>
      <div style={{ pointerEvents: AUTO, width: 'fit-content' }}>
        <MyAlert {...alert} onClose={onClose} />
      </div>
    </div>
  );
}
