import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { map } from 'lodash'

import Modal from '../Modal';
import ChangeDisplayNameForm from './ChangeDisplayNameForm';
import ChangeMailForm from './ChangeMailForm';

export default function AccountOptions(props) {
    const {
        userInfo,
        setReloadUserInfo
    } = props;

    const [showModal, setShowModal] = useState(false);
    const [renderComponent, setRenderComponent] = useState(null)

    const selectComponent = (key) => {
        switch (key) {
            case 'displayName':
                setRenderComponent(
                    <ChangeDisplayNameForm
                        displayName={userInfo.displayName}
                        setShowModal={setShowModal}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                );
                setShowModal(true);
                break;
            case 'email':
                setRenderComponent(
                    <ChangeMailForm
                        email={userInfo.email}
                        setShowModal={setShowModal}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                );
                setShowModal(true);
                break;
            case 'password':
                setRenderComponent(<Text>Cambiando contraseña</Text>);
                setShowModal(true);
                break;

            default:
                break;
        }
    }

    const menuOptions = generateOptions(selectComponent);

    return (
        <View>
            {
                map(menuOptions, (menu, index) =>
                    (
                        <ListItem
                            key={index}
                            title={menu.title}
                            leftIcon={{
                                type: menu.iconType,
                                name: menu.iconNameLeft,
                                color: menu.iconColorLeft
                            }}
                            rightIcon={{
                                type: menu.iconType,
                                name: menu.iconNameRigth,
                                color: menu.iconColorRigth
                            }}
                            containerStyle={styles.menuItem}
                            onPress={menu.onPress}
                        />
                    )
                )
            }

            {renderComponent && (
                <Modal
                    isVisible={showModal}
                    setIsVisible={setShowModal}
                >
                    {renderComponent}
                </Modal>
            )}
        </View>

    )
}


function generateOptions(selectComponent) {
    return [
        {
            title: 'Cambiar nombre y apellidos',
            iconType: 'material-community',
            iconNameLeft: 'account-circle',
            iconColorLeft: '#00a680',
            iconNameRigth: 'chevron-right',
            iconColorRigth: '#00a680',
            onPress: () => selectComponent('displayName')
        },
        {
            title: 'Cambiar email',
            iconType: 'material-community',
            iconNameLeft: 'at',
            iconColorLeft: '#00a680',
            iconNameRigth: 'chevron-right',
            iconColorRigth: '#00a680',
            onPress: () => selectComponent('email')
        },
        {
            title: 'Cambiar contraseña',
            iconType: 'material-community',
            iconNameLeft: 'lock-reset',
            iconColorLeft: '#00a680',
            iconNameRigth: 'chevron-right',
            iconColorRigth: '#00a680',
            onPress: () => selectComponent('password')
        }
    ]
}

const styles = StyleSheet.create({
    menuItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3'
    }
});
