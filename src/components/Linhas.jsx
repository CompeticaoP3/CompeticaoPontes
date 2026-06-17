import '../Pontes.css'

function Linhas({ kilo, label }) {
  const getPositionId = () => {
    if (label === "PRÓXIMA CARGA") return "proximo";
    if (label === "CARGA ANTERIOR") return "anterior";
    return "desconhecido";
  };

  return (
    <div className='linhas'>
      <div className='linha'>
        <div className='esquerda-linha'>
          <div className="caixa_tipo">
            <p>{label}</p>
          </div>
        </div>

        <div className='direita-linha'>
          {kilo && (
            <div className="caixa_kilo" id={getPositionId()}>
              <p>{kilo}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Linhas;
