import React from 'react';
import { View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { colors } from '../styles/colors';

const CategoryPieChart = ({ data }) => {
    const screenWidth = Dimensions.get('window').width;

    const chartData = data.map((item, index) => ({
        name: item.name,
        population: item.amount,
        color: item.color || colors.categories[index % colors.categories.length],
        legendFontColor: colors.text.primary,
        legendFontSize: 12,
    }));

    const chartConfig = {
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    };

    return (
        <View>
            <PieChart
                data={chartData}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
            />
        </View>
    );
};

export default CategoryPieChart;
