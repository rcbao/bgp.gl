import Chart from "react-apexcharts";

const PrefixDistributionChart = (props) => {
    if (!props.data) {
        return null;
    }
    const state = {
        options: {
            stroke: {
                curve: "smooth",
            },
            theme: {
                mode: "light",
            },
            markers: {
                size: 0,
            },
            xaxis: {
                title: {
                    text: "IP Prefix Lengths",
                    offsetY: -12,
                    style: {
                        fontSize: "18px",
                    },
                },
                categories: props.data["lengths"],
                tickAmount: 8,
                labels: {
                    style: {
                        fontSize: "16px",
                    },
                    rotate: 0,
                },
            },
            yaxis: {
                tickAmount: 3,
                title: {
                    text: "# Occurances",
                    style: {
                        fontSize: "18px",
                    },
                },
                labels: {
                    formatter: function (val) {
                        return val.toExponential(1);
                    },
                    style: {
                        fontSize: "16px",
                    },
                },
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val.toFixed(0);
                    },
                },
            },
        },
        series: [
            {
                name: "Number of Occurances",
                data: props.data["counts"],
            },
        ],
    };

    return (
        <div className="col-span-2">
            <h2 className="text-xl font-bold">
                Prefix Lengths Distribution in {props.regionName}
            </h2>
            <Chart
                options={state.options}
                series={state.series}
                type="line"
                width="100%"
                height="300"
            />
        </div>
    );
};

export default PrefixDistributionChart;
