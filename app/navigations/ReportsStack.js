
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Reports from '../screens/reports/Reports';
import addReports from '../screens/reports/addReports';

const Stack = createStackNavigator();

export default function ReportsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="reports"
                component={Reports}
                options={{ title: 'Reportes' }} />
            <Stack.Screen
                name="add-reports"
                component={addReports}
                options={{ title: 'Llegada' }} />
            <Stack.Screen
                name="exit-reports"
                component={addReports}
                options={{ title: 'Salida' }} />
            <Stack.Screen
                name="incapacity-reports"
                component={addReports}
                options={{ title: 'Incapacidad' }} />
        </Stack.Navigator>
    )
}
