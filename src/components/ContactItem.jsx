// A single contact row. The delete action is executed from the parent
// via the onDelete prop (child -> parent communication).
function ContactItem({ contact, onDelete }) {
  return (
    <li className="contact-item">
      <div>
        <strong>{contact.name}</strong>
        <span>{contact.phone}</span>
      </div>
      <button onClick={() => onDelete(contact.id)}>Eliminar</button>
    </li>
  );
}

export default ContactItem;
