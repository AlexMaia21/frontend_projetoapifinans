<template>
  <div>
    <canvas id="chartCategoriesExpense"></canvas>
  </div>
</template>

<script>
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
} from "chart.js";

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
);
import doughnutChartConfig from "../doughnutChartConfig.js";
export default {
  name: "chart-categories-expense",
  props: ['dataExpenseProp'],
  data() {
    return {
      dataExpense: this.dataExpenseProp
    };
  },
  mounted() {
    const objLabelsAndData = {};
    this.dataExpense.forEach(obj => {
      if(objLabelsAndData[obj.category]){
        objLabelsAndData[obj.category] += Number(obj.value);
      } else {
        objLabelsAndData[obj.category] = Number(obj.value);
      }
    });

    const backgroundColorsChartRevenue = ['#E83B3A', '#EB6E08', '#F1E94A', '#7AE63B', '#4256ED', '#ED3BD3', '#745CB1', '#ccc'];

    // CONFIGS CHART
    const configs = doughnutChartConfig({
      labels: Object.keys(objLabelsAndData),
      data: Object.values(objLabelsAndData),
      backgroundColors: backgroundColorsChartRevenue,
    });

    const ctx = document.querySelector("#chartCategoriesExpense");
    new Chart(ctx, configs);
  },
};
</script>

<style>
</style>