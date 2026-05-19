import React, { useState, useRef, useEffect } from "react";

export function Esp32ConnectionPopup({ setShowApoioPopup }) {
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
        // Aqui você pode processar os dados recebidos (ex: leitura de sensores)
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

  return (
    <div className="popup-overlay" onClick={() => setShowApoioPopup(false)}>
      <div
        className="popup-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-title">
          <h2 className="popup-text">Conexão ESP32</h2>
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
            className="popup-connect" 
            onClick={handleConnect}
            disabled={status === "Conectando..."}
          >
            {status === "Conectando..." ? "Aguarde..." : "Conectar"}
          </button>
          
          <button
            className="popup-ok"
            onClick={() => {
              console.log("Confirmado, mantendo conexão em background se houver");
              setShowApoioPopup(false);
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}