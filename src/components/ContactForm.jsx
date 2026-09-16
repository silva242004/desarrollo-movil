import { useState } from 'react';

// Form to add a new contact. Receives onAdd(contact) from its parent.
function ContactForm({ onAdd }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Nombre y telefono son obligatorios');
      return;
    }
    onAdd({ id: Date.now(), name: name.trim(), phone: phone.trim() });
    setName('');
    setPhone('');
    setError('');
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>Agregar contacto</h2>
      <input
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Telefono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button type="submit">Agregar</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default ContactForm;
