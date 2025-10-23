import { useState } from 'react'
import '../Pontes.css'

function Linhas(props) {
    const propsStyle = {width: props.kilo === '5KG' ? "13vh" : "18vh",backgroundColor: props.tipo === 'Carga Atual' ? '#507d46' : '#006494'};
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
                            style= {propsStyle}
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
