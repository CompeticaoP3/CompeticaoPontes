import React, { useState, useRef, useEffect } from "react";

export function Esp32Connection({ show, setShow, action }) {
  const [ipAddress, setIpAddress] = useState("");
  const [status, setStatus] = useState("Desconectado");
  const wsRef = useRef(null);

  // Função para lidar com a conexão WebSocket
  const handleConnect = () => {
    if (!ipAddress) {
      alert("Por favor, insira um endereço IP válido.");
      return;
    }

    setStatus("Conectando...");

    // Fecha conexão anterior, se existir
    if (wsRef.current) {
      wsRef.current.close();
    }

    // A porta 81 é o padrão comum para bibliotecas de WebSocket no ESP32, 
    // ajuste conforme a configuração no firmware do seu microcontrolador.
    const wsUrl = `ws://${ipAddress}:81`; 

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("Conectado ao ESP32");
        setStatus("Conectado");
        
        // Exemplo: enviar uma mensagem ao conectar
        // ws.send("Hello ESP32");
      };

      ws.onmessage = (event) => {
        console.log("Dados recebidos do ESP32:", event.data);
        if(event.data === "BOTAO_PRESSIONADO") {
          action(); // Chama a função passada como prop para lidar com o evento
        }
      };

      ws.onerror = (error) => {
        console.error("Erro no WebSocket:", error);
        setStatus("Erro na conexão");
      };

      ws.onclose = () => {
        console.log("Conexão fechada");
        setStatus("Desconectado");
      };

      // Armazena a instância no useRef para persistir sem re-renderizar
      wsRef.current = ws; 
    } catch (error) {
      console.error("Erro ao tentar instanciar WebSocket:", error);
      setStatus("Erro na conexão");
    }
  };

  // Limpa a conexão WebSocket quando o componente for desmontado (fechado)
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  if (!show) return null;

  return (
    <div className="popup-overlay" onClick={() => setShow(false)}>
      <div
        className="popup-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-title">
          <h2 className="popup-text">Conexão ESP32</h2>
          <button 
            className="popup-close"
            onClick={() => setShow(false)}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              padding: "0",
              marginLeft: "auto"
            }}
          >
            ✕
          </button>
        </div>

        <input
          className="popup-input"
          placeholder="Digite o IP do ESP32 para conectar"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
        />
        
        {/* Feedback visual de status */}
        <p style={{ fontSize: '0.9rem', color: status === 'Conectado' ? 'green' : 'gray' }}>
          Status: {status}
        </p>

        <div className="popup-buttons">
          <button 
            className="popup-ok" 
            onClick={handleConnect}
            disabled={status === "Conectando..."}
          >
            {status === "Conectando..." ? "Aguarde..." : "Conectar"}
          </button>
        </div>
      </div>
    </div>
  );
}
