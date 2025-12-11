// src/pages/Register.tsx (CÓDIGO COMPLETO Y FINAL SIN ERRORES)

import React, { useState } from 'react';
import { 
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, 
    IonButton, IonLoading, IonLabel, IonItem, IonAlert 
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

// Importación ya corregida
import { useAuth } from "../context"; 

const Register: React.FC = () => {
    const { register, loading } = useAuth();
    const history = useHistory();
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            setShowAlert(true);
            return;
        }

        try {
            await register(nombre, correo, password, 'VE'); 
            history.push('/home'); 
        } catch (err: unknown) { // CORRECCIÓN ESLINT: Usamos 'unknown' y comprobamos
            let errorMessage = 'Ocurrió un error desconocido.';
            if (err instanceof Error) {
                if ('code' in err && err.code === 'auth/email-already-in-use') {
                    errorMessage = 'El correo electrónico ya está registrado.';
                } else {
                    errorMessage = 'Error al registrar: ' + err.message;
                }
            }
            setError(errorMessage);
            setShowAlert(true);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Registro infoUrbi</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <IonLoading isOpen={loading} message={'Registrando...'} />
                
                <IonItem>
                    <IonLabel position="stacked">Nombre completo</IonLabel>
                    <IonInput 
                        value={nombre} 
                        placeholder="Ingresa tu nombre"
                        onIonChange={(e) => setNombre(e.detail.value!)} 
                        type="text" 
                        required
                    />
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">Correo electrónico</IonLabel>
                    <IonInput 
                        value={correo} 
                        placeholder="ejemplo@correo.com"
                        onIonChange={(e) => setCorreo(e.detail.value!)} 
                        type="email" 
                        required
                    />
                </IonItem>
                
                <IonItem>
                    <IonLabel position="stacked">Contraseña</IonLabel>
                    <IonInput 
                        value={password} 
                        placeholder="Contraseña segura"
                        onIonChange={(e) => setPassword(e.detail.value!)} 
                        type="password" 
                        required
                    />
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">Confirmar Contraseña</IonLabel>
                    <IonInput 
                        value={confirmPassword} 
                        placeholder="Repite la contraseña"
                        onIonChange={(e) => setConfirmPassword(e.detail.value!)} 
                        type="password" 
                        required
                    />
                </IonItem>

                <IonButton expand="block" onClick={handleRegister} className="ion-margin-top" disabled={loading}>
                    Registrar
                </IonButton>

                <IonButton expand="block" fill="clear" routerLink="/login" className="ion-margin-top">
                    ¿Ya tienes cuenta? Inicia sesión
                </IonButton>

                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header={'Error'}
                    message={error || 'Ocurrió un error inesperado.'}
                    buttons={['OK']}
                />
            </IonContent>
        </IonPage>
    );
};

export default Register;