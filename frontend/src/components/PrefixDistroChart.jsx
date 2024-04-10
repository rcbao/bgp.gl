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
                categories: props.data["lengths"],
            },
            yaxis: {
                labels: {
                    formatter: function (val) {
                        return val.toExponential(1);
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
        <div className="col-span-2 my-2">
            <h2 className="text-xl font-bold my-4">
                Prefix Lengths Distribution in the United States
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
