import { useState } from 'react'
import '../Pontes.css'

function Popup({ cargaRuptura, onOk, onCancel }) {
    const [inputValue, setInputValue] = useState("")

    const handleOk = () => {
        if (onOk) onOk(inputValue)
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
                        placeholder={cargaRuptura}
                    />

                    <div className="popup-buttons">
                        <button className="popup-ok" onClick={handleOk}>Confirmar</button>
                        <button className="popup-cancel" onClick={handleCancel}>Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Popup
