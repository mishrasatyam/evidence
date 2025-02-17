import getDistinctValues from './getDistinctValues.js'

export default function getSeriesConfig(data, x, y, series, swapXY, baseConfig, name=null, xMismatch, columnSummary) {

    function generateTempConfig(seriesData, seriesName, baseConfig) {
        let tempConfig = {
            name: seriesName,
            data: seriesData
        }
        tempConfig = {...baseConfig, ...tempConfig};
        return tempConfig;
    }

    let i;
    let j;
    let legend;
    let tempConfig;
    let seriesConfig = [];
    let seriesData;
    let filteredData;
    let seriesName;
    let seriesDistinct;

    // 1) Series column with single y column
    if (series != null && typeof y !== "object") {
        legend = true;
        seriesDistinct = getDistinctValues(data, series);

        for (i = 0; i < seriesDistinct.length; i++) {
            // Filter for specific series:
            filteredData = data.filter((d) => d[series] === seriesDistinct[i]);

            if(swapXY){
                seriesData = filteredData.map((d) => [d[y], (xMismatch ? d[x].toString() : d[x])]);
            } else {
                seriesData = filteredData.map((d) => [(xMismatch ? d[x].toString() : d[x]), d[y]]);
            }

            // Set series name:
            seriesName = seriesDistinct[i];

            tempConfig = generateTempConfig(seriesData, seriesName, baseConfig);
            seriesConfig.push(tempConfig);
        }
    }

    // 2) Series column with multiple y columns
    if (series != null && typeof y === "object" && y.length > 1) {
        legend = true;

        seriesDistinct = getDistinctValues(data, series);
        for (i = 0; i < seriesDistinct.length; i++) {
            // Filter for specific series:
            filteredData = data.filter((d) => d[series] === seriesDistinct[i]);
     
            for (j = 0; j < y.length; j++) {

                if(swapXY){
                    seriesData = filteredData.map((d) => [d[y[j]], (xMismatch ? d[x].toString() : d[x])]);
                } else {
                    seriesData = filteredData.map((d) => [(xMismatch ? d[x].toString() : d[x]), d[y[j]]]);
                }

                // Set series name:
                seriesName = seriesDistinct[i] + " - " + columnSummary[y[j]].title;
                tempConfig = generateTempConfig(seriesData, seriesName, baseConfig);
                seriesConfig.push(tempConfig);
            }
        }
    }

    // 3) Multiple y columns without series column
    if (series == null && typeof y === "object" && y.length > 1) {
        legend = true;

        for (i = 0; i < y.length; i++) {
            if(swapXY){
                seriesData = data.map((d) => [d[y[i]], (xMismatch ? d[x].toString() : d[x])]);
            } else {
                seriesData = data.map((d) => [(xMismatch ? d[x].toString() : d[x]), d[y[i]]]);
            }
            seriesName = columnSummary[y[i]].title;
            tempConfig = generateTempConfig(seriesData, seriesName, baseConfig);
            seriesConfig.push(tempConfig);
        }
    }
    
    // 4) Single y column without series column
    if(series == null && typeof y !== "object") {
        legend = false;

        if(swapXY){
            seriesData = data.map((d) => [d[y], (xMismatch ? d[x].toString() : d[x])]);
        } else {
            seriesData = data.map((d) => [(xMismatch ? d[x].toString() : d[x]), d[y]]);
        }

        tempConfig = generateTempConfig(seriesData, seriesName=name, baseConfig);
        seriesConfig.push(tempConfig);
    }

    return seriesConfig;

}
