export const makeChartResponse = (
  data: any,
  chartTitle: string,
  labelProp: string = "title",
  valueProp: string = "count",
  colors: string[] = []
) => {
  const labels: string[] = [];
  const values: number[] = [];

  // Aggregate data to create labels and values arrays
  data.forEach((entry: any) => {
    labels.push(entry[labelProp]);
    values.push(entry[valueProp]);
  });

  const datasets = [
    {
      label: chartTitle,
      data: values,
      backgroundColor:
        colors.length > 0
          ? colors
          : Array(data.length).fill(
              `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
                Math.random() * 256
              )}, ${Math.floor(Math.random() * 256)}, 0.5)`
            ), // Use provided colors or generate random colors for each data point
      borderWidth: 2,
      barThickness:24,
      
    },
  ];

  const chartData = {
    labels: labels,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: chartTitle,
      },
    },
  };

  return {
    data: chartData,
    options: options,
  };
};
