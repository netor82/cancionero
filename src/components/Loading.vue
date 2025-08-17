<template>
    <div class="loading"></div>
</template>

<style>
.loading {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-block;
  background-color: var(--color-hover);
  margin: 6px 30px;
  animation: shadowExpandX 1.5s linear infinite alternate;
}

@keyframes shadowExpandX {
  0% {
    box-shadow: 0 0, 0 0;
    color: var(--color-background);
  }
  100% {
    box-shadow: -24px 0, 24px 0;
    color: var(--color-hover);
  }
}</style>