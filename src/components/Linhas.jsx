import '../Pontes.css'

function Linhas({ kilo, label }) {
  return (
    <div className='linhas'>
      <div className='linha'>
        <div className='esquerda-linha'>
          <div className="caixa" id="tipo">
            <p>{label}</p>
          </div>
        </div>

        <div className='meio-linha'>
          {kilo && (
            <div className="caixa" id="kilo">
              <p>{kilo}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Linhas;
