import { BORDER_WIDTH, POINTER, BOLD, FLEX, CENTER} from "../../../config/index.jsx";
export default function SaveAsDraft({ defaultChecked }) {
     return(<label
                style={{
                display: FLEX,
                alignItems: CENTER,
                gap: '0.6rem',
                padding: '0.6rem 0.8rem',
                border: `${BORDER_WIDTH} solid #e5e7eb`,
                borderRadius: '10px',
                background: '#fafafa',
                color: '#4b5563',
                cursor: POINTER,
                }}
            >
                <input
                type="checkbox"
                name="is_draft"
                defaultChecked={defaultChecked}
                style={{
                    width: '1.05rem',
                    height: '1.05rem',
                    accentColor: '#9ca3af',
                    cursor: POINTER,
                }}
                />
                <span style={{ fontWeight: BOLD }}>
                Save as Draft
                </span>
                </label>);
}