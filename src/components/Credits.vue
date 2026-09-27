<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(false);

function open(): void {
    isOpen.value = true;
}

function close(): void {
    isOpen.value = false;
}
</script>

<template>
  <button class="credits-btn" @click="open">Créditos</button>

  <div class="modal-overlay" v-if="isOpen" @click.self="close">
    <div class="modal">
      <button class="modal-close" @click="close" title="Cerrar">✕</button>
      <div class="modal-content">
        <h2>Créditos y fuentes</h2>

        <p>La intención de este cancionero es facilitar a la comunidad el acceso a los cantos, ofrecer una búsqueda más ágil que su contraparte impresa, y dar a los coros una manera sencilla de planear los cantos de la misa y compartir la lista entre sus compañeros.</p>

        <p>Bajo ningún motivo somos los dueños intelectuales de los cantos, sus acordes, ni de cualquier otro contenido mostrado en este cancionero (enlaces externos, videos de YouTube, ni de cualquier otra índole).</p>

        <h3>Fuentes de los cantos</h3>
        <ul>
          <li>Los cantos marcados con el tag <strong>Cantar Alegres</strong> fueron tomados del cancionero con el mismo nombre elaborado por el Prof. Roy Alberto Gutiérrez Chacón (2001-2005, edición revisada 2018). Contacto: yorberto@hotmail.com, tel. (+506) 8866-9296.</li>
          <li>Los marcados con el tag <strong>Schola Cantorum</strong> fueron tomados del cancionero con el mismo nombre, publicado en 2018 por el Seminario Nacional Nuestra Señora de los Ángeles, Costa Rica.</li>
          <li>Los demás cantos, sin estas etiquetas, fueron tomados de diferentes fuentes, siempre intentando respetar los derechos de autor.</li>
        </ul>

        <h3>Licencia del código fuente</h3>
        <p>El código fuente de esta aplicación se distribuye bajo la <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener">Licencia Apache 2.0</a>. Esta licencia cubre únicamente el software; no aplica al contenido de los cantos, acordes ni demás material mostrado, cuyos derechos pertenecen a sus respectivos autores.</p>

        <h3>Contacto</h3>
        <p>Para cualquier cambio, corrección o reclamo de autoría, por favor enviar un correo a netor82@gmail.com.</p>
        <p>Código fuente disponible en <a href="https://github.com/netor82/cancionero" target="_blank" rel="noopener">github</a>.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.credits-btn {
  background: none;
  border: none;
  color: inherit;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font: inherit;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--color-background, #fff);
  color: inherit;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 8px;
  padding: 24px;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: inherit;
}

.modal-content h2 {
  margin-top: 0;
}

.modal-content ul {
  padding-left: 1.2em;
}
</style>
