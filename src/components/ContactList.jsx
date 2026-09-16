import ContactItem from './ContactItem';

// Renders the contact array using map(), as covered in class.
function ContactList({ contacts, onDelete }) {
  if (contacts.length === 0) {
    return <p className="empty">No hay contactos todavia.</p>;
  }

  return (
    <ul className="contact-list">
      {contacts.map((contact) => (
        <ContactItem key={contact.id} contact={contact} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export default ContactList;
