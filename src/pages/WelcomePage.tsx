import React from 'react';
import { IonPage, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const WelcomePage: React.FC = () => {
    const history = useHistory();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="secondary">
                    <IonTitle>Bienvenido</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding ion-text-center">
                <IonGrid fixed>
                    <IonRow className="ion-justify-content-center ion-padding-top">
                        <IonCol size="12" sizeMd="6">
                            <IonCard>
                                <IonCardHeader>
                                    <IonCardTitle color="secondary">
                                        ¡Bienvenido a la Aplicación!
                                    </IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <p className="ion-text-wrap ion-padding-bottom">
                                        Parece que no has iniciado sesión. Puedes explorar nuestra app después de autenticarte.
                                    </p>
                                    
                                    <IonButton 
                                        expand="block" 
                                        color="primary" 
                                        className="ion-margin-top"
                                        onClick={() => history.push('/login')}
                                    >
                                        Iniciar Sesión
                                    </IonButton>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default WelcomePage;