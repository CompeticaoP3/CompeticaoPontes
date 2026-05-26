import { useState, useEffect, useRef } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import './Pontes.css'
import Linhas from './components/Linhas'
import Popup from './components/Popup'
import { Esp32Connection } from './components/Esp32Connection'
import { LINHAS_INICIAIS } from './model/linhasIniciais'

function Pontes() {
  const [linhas, setLinhas] = useState(LINHAS_INICIAIS);
  const [ativo, setAtivo] = useState(false);
  const [equipe, setEquipe] = useState({});
  const [equipes, setEquipes] = useState([]);
  const [pesoTotal, setPesoTotal] = useState("0KG");
  const [cargaPrevista, setCargaPrevista] = useState("0KG");
  const [cargaAcumulada, setCargaAcumulada] = useState(11);
  const [massaPonte, setMassaPonte] = useState("0KG");
  const [showPopup, setShowPopup] = useState(false);
  const [showApoioPopup, setShowApoioPopup] = useState(false);
  const [primeiroClique, setPrimeiroClique] = useState(false);
  const [pulsingColor, setPulsingColor] = useState('#00ff88');

  const selectRef = useRef(null);

  const [indiceAtual, setIndiceAtual] = useState(LINHAS_INICIAIS.length - 1);

  const moverAtual = (novaPosicao) => {
    setIndiceAtual(novaPosicao);
    
    const kiloNovaCarga = LINHAS_INICIAIS[novaPosicao]?.kilo || "0KG";
    const valorCarga = parseInt(kiloNovaCarga.replace("KG", ""));
    const novoTotal = cargaAcumulada + valorCarga;

    setCargaAcumulada(novoTotal);
    setPesoTotal(novoTotal + "KG");
  };

  useEffect(() => {
    fetch("https://web-production-2502.up.railway.app/api/equipes")
      .then(res => {
        if (!res.ok) throw new Error(`Erro na resposta: ${res.status}`);
        return res.json();
      })
      .then(data => setEquipes(data))
      .catch(err => console.error("Erro ao buscar equipes:", err));
  }, []);

  const handleClick = () => {
    if (!ativo) {
      if (!primeiroClique) {
        setLinhas(prev =>
          prev.map(l =>
            l.tipo === "Carga Atual"
              ? { ...l, kilo: "11KG", kilorecorde: "11KG" }
              : l
          )
        );
        setPesoTotal("11KG");
        setPrimeiroClique(true);
      }

      setAtivo(true);
    } else {
      setAtivo(false);
      setShowPopup(true);
    }
  };

  const handleEquipeChange = (e) => {
    const novaEquipe = equipes.find(eq => eq.nome === e.target.value);

    setEquipe(novaEquipe);
    setMassaPonte(novaEquipe.massaPonte + "KG");
    setLinhas([...LINHAS_INICIAIS]);
    setPesoTotal("0KG");
    setCargaPrevista(novaEquipe.cargaPrevista + "KG");
    setCargaAcumulada(11);

    setAtivo(false);
    setPrimeiroClique(false);
    setShowPopup(false);

    e.target.blur();
  };

  return (
    <div
      className='pontes'
      onClick={handleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        handleClick();
      }}
    >
      <div className={`pesos ${primeiroClique ? 'primeiro-clique-ativo' : 'primeiro-clique-inativo'}`}>
        <Linhas 
          label="PRÓXIMA CARGA" 
          kilo={LINHAS_INICIAIS[indiceAtual > 0 ? indiceAtual - 1 : 0]?.kilo} 
        />
        <Linhas 
          label="CARGA ATUAL" 
          kilo={LINHAS_INICIAIS[indiceAtual]?.kilo} 
        />
        <Linhas 
          label="CARGA ANTERIOR" 
          kilo={LINHAS_INICIAIS[indiceAtual < LINHAS_INICIAIS.length - 1 ? indiceAtual + 1 : LINHAS_INICIAIS.length - 1]?.kilo} 
        />
      </div>

      <div className='principal'>
        <div className='equipe'>
          <select
            ref={selectRef}
            name="equipes"
            id="equipes"
            value={equipe?.nome || ""}
            onChange={handleEquipeChange}
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            {!equipe?.nome && (
              <option value="" disabled>
                Selecione a Equipe
              </option>
            )}
            {equipes.map((equipeItem) => (
              <option key={equipeItem.id} value={equipeItem.nome}>
                {equipeItem.nome}
              </option>
            ))}
          </select>

          <h3>{massaPonte}</h3>
        </div>

        <div className='contagem'>
          <div className="pulsing-circle" style={{ '--pulsing-color': pulsingColor }}>
            <CountdownCircleTimer
              key={ativo ? 'running' : 'stopped'}
              isPlaying={ativo}
              duration={10}
              size={475}
              strokeLinecap="butt"
              trailColor="#ffffff"
              strokeWidth={25}
              colors={['#00ff88', '#ffaa00', '#ff0000']}
              colorsTime={[10, 5, 0]}
              onComplete={() => {
                setAtivo(false)
                moverAtual(indiceAtual > 0 ? indiceAtual - 1 : 0)
                return { shouldRepeat: false }
              }}
            >
              {({ remainingTime }) => {
                const color = remainingTime > 5 ? '#00ff88' : remainingTime > 0 ? '#f17c0e' : '#ff0000';
                setPulsingColor(color);

                return (
                  <p className="tempo">
                    {remainingTime}
                  </p>
                );
              }}
            </CountdownCircleTimer>
          </div>
        </div>
      </div>

      <div className='direita'>
        <div className='icones'>
          <a href="https://www.pontes.ufersa.dev.br"><img src="/pontesLogo.png" alt="" /></a>
        </div>
        <div className='cargas'>
          <div className='cargastitulo'>
            <div className='estimada'>
              <p style={{ fontWeight: "400", fontSize: "35px" }}>CARGA</p>
              <p style={{ fontWeight: "400", fontSize: "40px" }}>ESTIMADA</p>
              <p>{cargaPrevista}</p>
            </div>
            <div className='proxima'>
              <div style={{ width: '100%', height: '2px', backgroundColor: 'white', margin: '20px 0' }}></div>
              <p style={{ marginTop: "3vh", fontWeight: "400", fontSize: "35px" }}>PESO</p>
              <p style={{ fontWeight: "400", fontSize: "40px" }}>TOTAL</p>
              <p>{pesoTotal}</p>
            </div>
          </div>
        </div>

        <div className='apoio'>
          <div
            className='imagens'
            onClick={(e) => {
              e.stopPropagation();
              setShowApoioPopup(true);
            }}
          >
            <img src="/ufersa.png" alt="UFERSA" />
          </div>
        </div>
      </div>

      {showPopup && (
        <Popup
          cargaRuptura={pesoTotal}
          onOk={(valor) => {
            console.log("Usuário digitou:", valor)
            setShowPopup(false)
          }}
          onCancel={() => setShowPopup(false)}
        />
      )}

      <Esp32Connection
        show={showApoioPopup}
        setShow={setShowApoioPopup}
      />
    </div>
  );
}

export default Pontes;