<template>
  <div>
    <canvas ref="canvasId" width="350" height="350"></canvas>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import ClockCanvas from "../utils/clockCanvas";

const canvasId = ref(null);
const canvasId1 = ref(null);

onMounted(() => {
  const canvas = new ClockCanvas({
    id: canvasId.value,
    fillNumberColor: "#666",
    arcBorderColor: "#f1f1f1",
    dialLargeScaleColor: "#000",
    dialScaleColor: "#000",
    hourHandColor: "#000",
    minuteHandColor: "#000",
    secondHandColor: "#f00",
  });

  setInterval(() => {
    canvas.init();
  }, 1000);
});
</script>

<style lang="scss" scoped>
</style>