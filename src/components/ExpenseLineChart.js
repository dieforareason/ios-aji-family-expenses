import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../styles/colors';

const ExpenseLineChart = ({ data, labels }) => {
    const screenWidth = Dimensions.get('window').width;

    const chartConfig = {
        backgroundColor: colors.surface,
        backgroundGradientFrom: colors.surface,
        backgroundGradientTo: colors.surface,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: colors.primary,
        },
    };

    const chartData = {
        labels: labels,
        datasets: [
            {
                data: data,
            },
        ],
    };

    return (
        <View>
            <LineChart
                data={chartData}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={{
                    borderRadius: 8,
                }}
            />
        </View>
    );
};

export default ExpenseLineChart;
