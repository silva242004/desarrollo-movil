import { useEffect, useState } from 'react';
import './App.css';
import Loader from './components/Loader';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';

// Initial contacts, simulating what an API would return.
const INITIAL_CONTACTS = [
  { id: 1, name: 'luisa Torres', phone: '3801112233' },
  { id: 2, name: 'Luis petro', phone: '3709998877' },
  { id: 3, name: 'Marta obama', phone: '3014445566' },
];

function App() {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);

  // Simulate an initial data load (e.g. a fetch call) using useEffect,
  // as seen in class for handling side effects / component lifecycle.
  useEffect(() => {
    const timer = setTimeout(() => {
      setContacts(INITIAL_CONTACTS);
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const addContact = (contact) => {
    setContacts((prev) => [...prev, contact]);
  };

  const deleteContact = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="app">
      <h1> Contactos (React)</h1>

      {loading ? (
        <Loader />
      ) : (
        <>
          <ContactForm onAdd={addContact} />
          <ContactList contacts={contacts} onDelete={deleteContact} />
        </>
      )}
    </div>
  );
}

export default App;
