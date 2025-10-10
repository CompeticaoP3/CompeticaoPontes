import { useState, useEffect, useRef } from 'react'
import './Pontes.css'
import Linhas from './components/Linhas'

function Pontes() {
    const [linhas, setLinhas] = useState([
        { "tipo": "Recorde", "ordem": "23", "kilo": "10KG", "kilorecorde": "246KG" },
        { "tipo": "", "ordem": "22", "kilo": "10KG" },
        { "tipo": "", "ordem": "21", "kilo": "10KG" },
        { "tipo": "", "ordem": "20", "kilo": "10KG" },
        { "tipo": "", "ordem": "19", "kilo": "10KG" },
        { "tipo": "", "ordem": "18", "kilo": "10KG" },
        { "tipo": "", "ordem": "17", "kilo": "10KG" },
        { "tipo": "", "ordem": "16", "kilo": "10KG" },
        { "tipo": "", "ordem": "15", "kilo": "5KG" },
        { "tipo": "", "ordem": "14", "kilo": "5KG" },
        { "tipo": "", "ordem": "13", "kilo": "5KG" },
        { "tipo": "", "ordem": "12", "kilo": "10KG" },
        { "tipo": "", "ordem": "11", "kilo": "10KG" },
        { "tipo": "", "ordem": "10", "kilo": "10KG" },
        { "tipo": "", "ordem": "9", "kilo": "5KG" },
        { "tipo": "", "ordem": "8", "kilo": "5KG" },
        { "tipo": "", "ordem": "7", "kilo": "5KG" },
        { "tipo": "", "ordem": "6", "kilo": "10KG" },
        { "tipo": "", "ordem": "5", "kilo": "10KG" },
        { "tipo": "", "ordem": "4", "kilo": "10KG" },
        { "tipo": "", "ordem": "3", "kilo": "5KG" },
        { "tipo": "", "ordem": "2", "kilo": "5KG" },
        { "tipo": "Proxima Carga", "ordem": "1", "kilo": "5KG" },
        { "tipo": "Carga Atual", "ordem": "0", "kilo": "11KG" }
    ]);
    let recorde = 246
    const [contador, setContador] = useState(10)
    const [ativo, setAtivo] = useState(false)
    const [equipe, setEquipe] = useState("")
    const [equipes, setEquipes] = useState([])
    const [cargaAtual, setCargaAtual] = useState("11KG");
    const [cargaEstimada, setCargaEstimada] = useState("0KG");
    
    let pesoAtual = 0;
    let atual = linhas.indexOf(linhas.find(linha => linha.tipo === "Carga Atual"))

    const moverAtual = (novaPosicao) => {
        setLinhas((prevLinhas) => {
            const indexAtual = prevLinhas.findIndex((l) => l.tipo === "Carga Atual");
            if (indexAtual === -1) return prevLinhas;

            pesoAtual += parseInt(prevLinhas[indexAtual].kilo.trim().replace("KG", ""));
            console.log("Peso Atual:", pesoAtual);
            if (pesoAtual > recorde) {
                recorde = pesoAtual;
                alert(`Novo recorde: ${recorde}KG!`);
            }

            const novaCarga = prevLinhas[novaPosicao].kilo;
            setCargaAtual(novaCarga);

            return prevLinhas.map((l, i) => {
                if (i === novaPosicao) return { ...l, tipo: "Carga Atual" };
                if (i === novaPosicao - 1) return { ...l, tipo: "Proxima Carga" };
                if (l.tipo === "Recorde") return l;
                return { ...l, tipo: "" };
            });
        });
    };


    const [dados, setDados] = useState({
        equipe: "Equipe",
        massaDaPonte: "0KG",
        cargaEstimada: "0KG",
        proximaCarga: "0KG"
    })

    const selectRef = useRef(null)

    useEffect(() => {
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
                    if (prev <= 0.1) {
                        setAtivo(false);
                        moverAtual(atual === 0 ? 7 : atual - 1);
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
            setContador(10)
        }
    }

    const handleEquipeChange = (e) => {
        setEquipe(e.target.value)
        moverAtual(linhas.length - 1)
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
                    <h3>{dados.massaDaPonte}</h3>
                </div>

                <div className='contagem'>
                    <div className='circulo' onClick={handleClick}>
                        <p>{contador === 10 ? 10 : contador.toFixed(1)}</p>
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
                            <p>{cargaEstimada}</p>
                        </div>
                        <div className='proxima'>
                            <p style={{ marginTop: "3vh" }}>CARGA</p>
                            <p>ATUAL</p>
                            <p>{cargaAtual}</p>
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
