import { useState, useEffect, useRef } from 'react'
import './Pontes.css'
import Linhas from './components/Linhas'

function Pontes() {
    const [linhas] = useState([
        { "ordem": "23", "kilo": "10KG" },
        { "ordem": "22", "kilo": "10KG" },
        { "ordem": "21", "kilo": "10KG" },
        { "ordem": "20", "kilo": "10KG" },
        { "ordem": "19", "kilo": "10KG" },
        { "ordem": "18", "kilo": "10KG" },
        { "ordem": "17", "kilo": "10KG" },
        { "ordem": "16", "kilo": "10KG" },
        { "ordem": "15", "kilo": "5KG" },
        { "ordem": "14", "kilo": "5KG" },
        { "ordem": "13", "kilo": "5KG" },
        { "ordem": "12", "kilo": "10KG" },
        { "ordem": "11", "kilo": "10KG" },
        { "ordem": "10", "kilo": "10KG" },
        { "ordem": "9", "kilo": "5KG", },
        { "ordem": "8", "kilo": "5KG" },
        { "ordem": "7", "kilo": "5KG" },
        { "ordem": "6", "kilo": "10KG" },
        { "ordem": "5", "kilo": "10KG" },
        { "ordem": "4", "kilo": "10KG" },
        { "ordem": "3", "kilo": "5KG" },
        { "ordem": "2", "kilo": "5KG" },
        { "ordem": "1", "kilo": "5KG" },
        { "tipo": "teste", "ordem": "0", "kilo": "11KG", "kilorecorde": "15KG" },
    ])

    const [contador, setContador] = useState(10)
    const [ativo, setAtivo] = useState(false)
    const [equipe, setEquipe] = useState("")
    const [equipes, setEquipes] = useState([])

    const [dados, setDados] = useState({
        equipe: "Equipe",
        peso: "0KG",
        cargaEstimada: "0KG",
        proximaCarga: "0KG"
    })

    const selectRef = useRef(null)

    useEffect(() => {
        fetch("https://exemploDeAPI/exemplo/pontes/1")
            .then(res => res.json())
            .then(data => {
                setDados({
                    peso: data.peso || "0KG",
                    cargaEstimada: data.cargaEstimada || "0KG",
                    proximaCarga: data.proximaCarga || "0KG"
                })
            })
            .catch(err => {
                console.error("Erro ao buscar dados:", err)
            });

        fetch("https://jsonplaceholder.typicode.com/users")
            .then(res => res.json())
            .then(data => {
                setEquipes(data);
            })
            .catch(err => {
                console.error("Erro ao buscar equipes:", err);
            });
    }, [])

    useEffect(() => {
        let intervalo;

        if (ativo) {
            intervalo = setInterval(() => {
                setContador((prev) => {
                    if (prev <= 1) {
                        setAtivo(false);
                        return 10;
                    }
                    return prev - 0.1;
                });
            }, 100);
        }

        return () => clearInterval(intervalo);
    }, [ativo]);

    const handleClick = () => {
        if (!ativo) {
            setContador(10)
            setAtivo(true)
        } else {
            setAtivo(false)
        }
    }

    const handleEquipeChange = (e) => {
        setEquipe(e.target.value)
        e.target.blur()
    }

    return (
        <div className='pontes'>
            <div className='pesos'>
                {linhas.map((linha, index) => (
                    <Linhas
                        key={index}
                        tipo={linha.tipo}
                        kilo={linha.kilo}
                        kilorecorde={linha.kilorecorde}
                    />
                ))}
            </div>

            <div className='principal'>
                <div className='equipe'>
                    <select
                        ref={selectRef}
                        name="equipes"
                        id="equipes"
                        value={equipe}
                        onChange={handleEquipeChange}
                    >
                        <option value="" disabled>Selecione a Equipe</option>
                        {equipes.map((equipeItem) => (
                            <option key={equipeItem.id} value={equipeItem.name}>
                                {equipeItem.name}
                            </option>
                        ))}
                    </select>
                    <h3>{dados.peso}</h3>
                </div>

                <div className='contagem'>
                    <div className='circulo' onClick={handleClick}>
                        <p>{contador.toFixed(1)}</p>
                    </div>
                </div>
                <div className='status'>
                    <h3>{ativo ? "Contando..." : "Contador"}</h3>
                </div>
            </div>

            <div className='direita'>
                <div className='icones'>
                    <img src="/pontesLogo.png" alt="" />
                </div>
                <div className='cargas'>
                    <div className='cargastitulo'>
                        <div className='estimada'>
                            <p>CARGA</p>
                            <p>ESTIMADA</p>
                            <p>{dados.cargaEstimada}</p>
                        </div>
                        <div className='proxima'>
                            <p style={{ marginTop: "3vh" }}>CARGA</p>
                            <p>ATUAL</p>
                            <p>{dados.proximaCarga}</p>
                        </div>
                    </div>
                </div>
                <div className='apoio'>
                    <div className='apoiotexto'>
                        <p>APOIO</p>
                    </div>
                    <div className='imagens'>
                        <img src="/proec.png" alt="" />
                        <img src="/prograd.png" alt="" />
                        <img src="/ufersa.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pontes
