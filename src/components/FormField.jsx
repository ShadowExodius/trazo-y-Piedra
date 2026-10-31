export default function FormField({ id, label, tipo = 'text', value, error, onChange, rows }) {
  const Elemento = tipo === 'textarea' ? 'textarea' : 'input'
  const props = tipo === 'textarea' ? { rows } : { type: tipo }

  return (
    <div className="campo">
      <label htmlFor={id}>{label}</label>
      <Elemento
        id={id}
        name={id}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        className={error ? 'input-error' : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `error-${id}` : undefined}
        {...props}
      />
      <span className={`error-texto${error ? ' activo' : ''}`} id={`error-${id}`} role="alert">
        {error}
      </span>
    </div>
  )
}
