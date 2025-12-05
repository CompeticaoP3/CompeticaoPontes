import { useState, useEffect } from 'react'
import '../Pontes.css'

function Popup({ cargaRuptura, onOk, onCancel }) {
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (cargaRuptura) {
      const numeroLimpo = cargaRuptura.replace(/\D/g, '').trim()
      setInputValue(numeroLimpo)
    }
  }, [cargaRuptura])

  const handleOk = async () => {
    const numeroLimpo = inputValue.replace(/\D/g, '').trim()

    if (!numeroLimpo) return alert("Valor de carga inválido!")

    setLoading(true)
    if (onOk) onCancel()
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
  }

  return (
    <div className="popup-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-title">
          <p className="popup-text">CONFIRMAR CARGA<br />DE RUPTURA</p>
          <img src="/pontesLogo.png" alt="Logo" />
        </div>

        <div className="popup-options">
          <input
            type="text"
            className="popup-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <div className="popup-buttons">
            <button className="popup-ok" onClick={handleOk} disabled={loading}>
              {loading ? "Enviando..." : "Confirmar"}
            </button>
            <button className="popup-cancel" onClick={handleCancel} disabled={loading}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup