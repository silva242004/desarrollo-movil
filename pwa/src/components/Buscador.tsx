interface Props {
  valor: string
  onChange: (valor: string) => void
}

// Componente hijo puramente controlado: el estado del texto de búsqueda
// vive en el padre (PacientesPage), este componente solo lo muestra y
// avisa cuando cambia.
const Buscador: React.FC<Props> = ({ valor, onChange }) => (
  <div className="buscador">
    <input
      type="text"
      placeholder="Buscar por nombre, apellido o CC..."
      value={valor}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)

export default Buscador
