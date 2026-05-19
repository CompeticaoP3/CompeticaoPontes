import { useState, useEffect, useRef } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import './Pontes.css'
import Linhas from './components/Linhas'
import Popup from './components/Popup'
import { Esp32ConnectionPopup } from './components/Esp32ConnectionPopup'

const LINHAS_INICIAIS = [
  { tipo: "", ordem: "23", kilo: "10KG", visivel: false },
  { tipo: "", ordem: "22", kilo: "10KG", visivel: false },
  { tipo: "", ordem: "21", kilo: "10KG", visivel: false },
  { tipo: "", ordem: "20", kilo: "10KG", visivel: false },
  { tipo: "", ordem: "19", kilo: "10KG", visivel: false },
  { tipo: "", ordem: "18", kilo: "10KG", visivel: false },
  { tipo: "", ordem: "17", kilo: "10KG", visivel: false },
  { tipo: "", ordem: "16", kilo: "10KG", visivel: false },
  { tipo: "", ordem: "15", kilo: "10KG", visivel: false },
  { tipo: "", ordem: "14", kilo: "10KG", visivel: false },
  { tipo: "", ordem: "13", kilo: "10KG", visivel: false },
  { tipo: "", ordem: "12", kilo: "10KG", visivel: false },
  { tipo: "", ordem: "11", kilo: "10KG", visivel: false },
  { tipo: "", ordem: "10", kilo: "10KG", visivel: false },
  { tipo: "", ordem: "9", kilo: "5KG", visivel: false },
  { tipo: "", ordem: "8", kilo: "5KG", visivel: false },
  { tipo: "", ordem: "7", kilo: "5KG", visivel: false },
  { tipo: "", ordem: "6", kilo: "10KG", visivel: false },
  { tipo: "", ordem: "5", kilo: "10KG", visivel: false },
  { tipo: "", ordem: "4", kilo: "10KG", visivel: false },
  { tipo: "", ordem: "3", kilo: "5KG", visivel: false },
  { tipo: "", ordem: "2", kilo: "5KG", visivel: false },
  { tipo: "Proxima Carga", ordem: "1", kilo: "5KG", kilorecorde: "Soma", visivel: true },
  { tipo: "Carga Atual", ordem: "0", kilo: "0KG", kilorecorde: "0KG", visivel: true }
];

function Pontes() {
  const [linhas, setLinhas] = useState(LINHAS_INICIAIS);
  const [ativo, setAtivo] = useState(false);
  const [equipe, setEquipe] = useState({});
  const [equipes, setEquipes] = useState([]);
  const [pesoColocado, setPesoColocado] = useState("0KG");
  const [cargaPrevista, setCargaPrevista] = useState("0KG");
  const [cargaAcumulada, setCargaAcumulada] = useState(11);
  const [massaPonte, setMassaPonte] = useState("0KG");
  const [showPopup, setShowPopup] = useState(false);
  const [showApoioPopup, setShowApoioPopup] = useState(false);
  const [primeiroClique, setPrimeiroClique] = useState(false);

  const selectRef = useRef(null);

  let atual = linhas.indexOf(linhas.find(linha => linha.tipo === "Carga Atual"));

  const moverAtual = (novaPosicao) => {
    setLinhas((prevLinhas) => {
      const indexAtual = prevLinhas.findIndex((l) => l.tipo === "Carga Atual");
      if (indexAtual === -1) return prevLinhas;

      const novaCarga = prevLinhas[novaPosicao].kilo;
      const valorCarga = parseInt(novaCarga.replace("KG", ""));
      const novoTotal = cargaAcumulada + valorCarga;

      setCargaAcumulada(novoTotal);
      setPesoColocado(novoTotal + "KG");

      return prevLinhas.map((l, i) => {
        if (i === novaPosicao) {
          return {
            ...l,
            tipo: "Carga Atual",
            kilorecorde: novoTotal + "KG"
          };
        }

        if (i === novaPosicao - 1) {
          return {
            ...l,
            tipo: "Proxima Carga",
            visivel: true,
            kilorecorde: "Soma"
          };
        }

        if (i === indexAtual) {
          return { ...l, tipo: "", kilorecorde: "" };
        }

        if (l.tipo === "Recorde") return l;

        return { ...l, tipo: "" };
      });
    });
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
        setPesoColocado("11KG");
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
    setPesoColocado("0KG");
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
        {linhas.map((linha, index) => (
          <Linhas
            key={index}
            tipo={linha.tipo}
            kilo={linha.kilo}
            kilorecorde={linha.kilorecorde}
            visivel={linha.visivel}
            primeiroClique={primeiroClique}
          />
        ))}
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
          <CountdownCircleTimer
            key={ativo ? 'running' : 'stopped'}
            isPlaying={ativo}
            duration={10}
            size={300}
            strokeLinecap="butt"
            trailColor="#ffffff"
            strokeWidth={10}
            colors={['#00ff88', '#ffaa00', '#ff0000']}
            colorsTime={[10, 5, 0]}
            onComplete={() => {
              setAtivo(false)
              moverAtual(atual === 0 ? 7 : atual - 1)
              return { shouldRepeat: false }
            }}
          >
            {({ remainingTime }) => (
              <p className="tempo">
                {remainingTime}
              </p>
            )}
          </CountdownCircleTimer>
        </div>
      </div>

      <div className='direita'>
        <div className='icones'>
          <a href="https://www.pontes.ufersa.dev.br"><img src="/pontesLogo.png" alt="" /></a>
        </div>
        <div className='cargas'>
          <div className='cargastitulo'>
            <div className='estimada'>
              <p style={{ fontWeight: "400", fontSize: "4.5vh" }}>CARGA</p>
              <p style={{ fontWeight: "400", fontSize: "4.5vh" }}>ESTIMADA</p>
              <p>{cargaPrevista}</p>
            </div>
            <div className='proxima'>
              <p style={{ marginTop: "3vh", fontWeight: "400", fontSize: "4.5vh" }}>PESO</p>
              <p style={{ fontWeight: "400", fontSize: "4.5vh" }}>COLOCADO</p>
              <p>{pesoColocado}</p>
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
          cargaRuptura={pesoColocado}
          onOk={(valor) => {
            console.log("Usuário digitou:", valor)
            setShowPopup(false)
          }}
          onCancel={() => setShowPopup(false)}
        />
      )}

      <Esp32ConnectionPopup
        show={showApoioPopup}
        setShow={setShowApoioPopup}
      />
    </div>
  );
}

export default Pontes;