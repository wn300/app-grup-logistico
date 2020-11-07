import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'

import ReportsStack from './ReportsStack';
import AccountStack from './AccountStack';

const Tab = createBottomTabNavigator();

export default function Navigation() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName='Reports'
                tabBarOptions={{
                    inactiveTintColor: '#646464',
                    activeTintColor: '#2860A4'
                }}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => screenOptions(route, color)
                })}
            >
                <Tab.Screen
                    name="reports"
                    component={ReportsStack}
                    options={{ title: 'Reportes' }}
                />
                <Tab.Screen
                    name="account"
                    component={AccountStack}
                    options={{ title: 'Cuenta' }} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

function screenOptions(route, color) {
    let iconName;

    switch (route.name) {
        case 'reports':
            iconName = 'compass-outline'
            break;
        case 'account':
            iconName = 'home-outline'
            break;

        default:
            break;
    }

    return (
        <Icon
            name={iconName}
            type='material-community'
            color={color}
            size={22}
        />
    );
}