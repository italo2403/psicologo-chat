// Importar Firebase Modular
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, orderBy, query } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCpUB8B4A-KSZC4NON0D9LOi3gFF4hK0sI",
  authDomain: "psico-b42cb.firebaseapp.com",
  projectId: "psico-b42cb",
  storageBucket: "psico-b42cb.appspot.com",
  messagingSenderId: "10451826384",
  appId: "1:10451826384:web:123f4861c79c6ce108d0d5",
  measurementId: "G-FYZXQY2FL9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para enviar nova mensagem do paciente
window.enviarMensagem = async function enviarMensagem() {
  const texto = document.getElementById('mensagem').value.trim();
  if (texto === "") {
    alert("Digite alguma coisa!");
    return;
  }

  try {
    await addDoc(collection(db, "mensagens"), {
      paciente: texto,
      resposta: "Aguardando resposta do psicólogo...",
      timestamp: new Date()
    });
    document.getElementById('mensagem').value = "";
    buscarMensagens();
  } catch (error) {
    console.error("Erro ao enviar mensagem: ", error);
  }
}

// Função para buscar mensagens e exibir
async function buscarMensagens() {
  const container = document.getElementById('mensagens-container');
  container.innerHTML = "";

  const q = query(collection(db, "mensagens"), orderBy("timestamp", "asc"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((docItem) => {
    const dados = docItem.data();
    const id = docItem.id;

    const card = document.createElement('div');
    card.className = 'card-mensagem';

    card.innerHTML = `
      <p><strong>Paciente:</strong> ${dados.paciente}</p>
      <div class="resposta">
        <strong>Psicólogo:</strong> ${dados.resposta}
      </div>
      <div class="botoes">
        <button class="edit-button" onclick="editarMensagem('${id}', '${dados.paciente}')">Editar Paciente</button>
        <button class="responder-button" onclick="responderMensagem('${id}', '${dados.resposta}')">Responder Psicólogo</button>
        <button class="excluir-button" onclick="excluirMensagem('${id}')">Excluir</button>
      </div>
    `;

    container.appendChild(card);
  });
}

// Função para editar mensagem do paciente
window.editarMensagem = async function editarMensagem(id, textoAntigo) {
  const novoTexto = prompt("Edite sua mensagem:", textoAntigo);
  if (novoTexto !== null) {
    const mensagemRef = doc(db, "mensagens", id);
    await updateDoc(mensagemRef, {
      paciente: novoTexto
    });
    buscarMensagens();
  }
}

// Função para o psicólogo responder a mensagem
window.responderMensagem = async function responderMensagem(id, respostaAntiga) {
  const novaResposta = prompt("Digite sua resposta:", respostaAntiga);
  if (novaResposta !== null) {
    const mensagemRef = doc(db, "mensagens", id);
    await updateDoc(mensagemRef, {
      resposta: novaResposta
    });
    buscarMensagens();
  }
}

// Função para excluir mensagem
window.excluirMensagem = async function excluirMensagem(id) {
  const confirmacao = confirm("Tem certeza que deseja excluir esta mensagem?");
  if (confirmacao) {
    const mensagemRef = doc(db, "mensagens", id);
    await deleteDoc(mensagemRef);
    buscarMensagens();
  }
}

// Buscar mensagens ao abrir a página
document.addEventListener("DOMContentLoaded", buscarMensagens);
