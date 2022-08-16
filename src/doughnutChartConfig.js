export default function doughnutChartConfig(configParams) {
    return {
        type: "doughnut",
        data: {
            labels: configParams.labels,
            datasets: [
                {
                    label: "Receitas por categoria",
                    data: configParams.data,
                    backgroundColor: configParams.backgroundColors,
                    borderColor: "fff",
                    borderWidth: 0,
                    hoverOffset: 2
                },
            ],
        },
        options: {
            plugins: {
                // TOOLTIP CONFIG
                tooltip: {
                    mode: 'index',
                    callbacks: {
                        label: function (context) {
                            const value = Number(context.parsed).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })
                            return `${context.label}: ${value}`;
                        }
                    }
                },
            },
            responsive: true,
        }
    };
}