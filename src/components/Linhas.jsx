import { useState } from 'react'
import '../Pontes.css'

function Linhas(props) {
    return (
        <div className='linhas'>
            <div className='linha'>
                <div className='esquerda-linha'>
                    {props.tipo && (
                        <div className="caixa" id="tipo">
                            <p>{props.tipo}</p>
                        </div>
                    )}
                </div>
                <div className='meio-linha'>
                    {props.kilo && (
                        <div
                            className="caixa"
                            id="kilo"
                            style={props.kilo === '5KG' ? { width: "13vh" } : { width: "18vh" }}
                        >
                            <p>{props.kilo}</p>
                        </div>
                    )}
                </div>
                <div className='direita-linha'>
                    {props.kilorecorde && (
                        <div className="caixa" id="kilorecorde">
                            <p>{props.kilorecorde}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Linhas
