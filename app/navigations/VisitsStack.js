
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Visits from '../screens/Visits';

const Stack = createStackNavigator();

export default function VisitsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="visits"
                component={Visits}
                options={{ title: 'Visitas' }} />
        </Stack.Navigator>
    )
}
