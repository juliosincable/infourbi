// src/components/PageWrapper.tsx (CÓDIGO MEJORADO)

import React from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuToggle,
    IonIcon,
    IonButton, // 👈 Importamos IonButton
} from '@ionic/react';
import { menu as menuIcon } from 'ionicons/icons'; 

interface PageWrapperProps {
    title: string;
    children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, children }) => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>{title}</IonTitle>
                    
                    {/* IMPLEMENTACIÓN DEL BOTÓN DE MENÚ (Slot END) */}
                    <IonButtons slot="end">
                        {/* Usamos IonMenuToggle y le pasamos el nombre del menú ('main'). 
                            Dentro, usamos IonButton para asegurar el estilo de botón.
                        */}
                        <IonMenuToggle menu="main">
                            <IonButton> 
                                <IonIcon slot="icon-only" icon={menuIcon} />
                            </IonButton>
                        </IonMenuToggle>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {children}
            </IonContent>
        </IonPage>
    );
};

export default PageWrapper;