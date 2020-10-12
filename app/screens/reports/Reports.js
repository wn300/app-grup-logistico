
import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';

export default function Reports(props) {
    const { navigation } = props;

    return (
        <ScrollView
            centerContent={true}
            style={styles.viewBody}
        >

            <View style={styles.viewBtn}>
                <Button
                    title='Llegada'
                    titleStyle={styles.titleBtnStyle}
                    buttonStyle={styles.btnStyle}
                    containerStyle={styles.btnContainer}
                    onPress={() => navigation.navigate('add-reports')}
                    icon={{
                        type: 'material-community',
                        name: "map-check-outline",
                        size: 40,
                        color: "white"
                    }}
                />
            </View>
            <View style={styles.viewBtn}>
                <Button
                    title='Salida'
                    titleStyle={styles.titleBtnStyle}
                    buttonStyle={styles.btnStyle}
                    containerStyle={styles.btnContainer}
                    onPress={() => navigation.navigate('exit-reports')}
                    icon={{
                        type: 'material-community',
                        name: "map-outline",
                        size: 40,
                        color: "white"
                    }}
                />
            </View>
            <View style={styles.viewBtn}>
                <Button
                    title='Incapacidad'
                    titleStyle={styles.titleBtnStyle}
                    buttonStyle={styles.btnStyle}
                    containerStyle={styles.btnContainer}
                    onPress={() => navigation.navigate('incapacity-reports')}
                    icon={{
                        type: 'material-community',
                        name: "flag-variant",
                        size: 40,
                        color: "white"
                    }}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        marginLeft: 30,
        marginRight: 30
    },
    viewBtn: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 80,
        marginTop: 50
    },
    btnStyle: {
        backgroundColor: '#00a680',
    },
    btnContainer: {
        width: '70%'
    },
    titleBtnStyle: {
        fontSize: 25,
        fontWeight: 'bold'
    }
})
