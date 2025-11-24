// Archivo: src/components/LoginForm.tsx (CORREGIDO)

import React, { useState } from "react";
import {
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonLoading,
    useIonToast,
} from "@ionic/react";
// Importamos el tipo FirebaseError para tipar los errores del catch
import { FirebaseError } from "firebase/app";

// CORRECCIÓN CLAVE: Importar useAuth desde el archivo barrel (index.ts)
// Asumimos que esta importación ya fue corregida a: import { useAuth } from "../context";
// Si el error persiste, la ruta es: import { useAuth } from "../context";
import { useAuth } from "../context"; 
// Aunque el comentario decía "../context/Auth", la corrección real para el error TS2305 es "../context"


const LoginForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Desestructuramos la función login del Context
    const { login } = useAuth();
    const [presentToast] = useIonToast(); // Hook para notificaciones rápidas

    // Función utilitaria para mostrar errores con Toast
    const showErrorToast = (message: string) => {
        presentToast({
            message: message,
            duration: 3000,
            color: "danger",
            position: "bottom",
        });
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Asumimos que 'login' en el Context acepta (email, password)
            await login(email, password); 
            // Si el login es exitoso, AnonymousRoute redirigirá automáticamente.
        } catch (err) {
            let friendlyMessage = "Ocurrió un error desconocido al iniciar sesión.";
            
            // 1. Verificamos si es una instancia de FirebaseError
            if (err instanceof FirebaseError) {
                console.error("Error de inicio de sesión (Firebase):", err);
                friendlyMessage = getFriendlyErrorMessage(err.code);
            } 
            // 2. Verificamos errores lanzados por el Service Layer (si son de tipo Error)
            else if (err instanceof Error) {
                console.error("Error de inicio de sesión (Service):", err);
                // Usamos el mensaje del error lanzado por el Service Layer (ej: 'Credenciales inválidas')
                friendlyMessage = err.message;
            } 
            
            showErrorToast(friendlyMessage);

        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Función utilitaria para traducir códigos de error de Firebase a mensajes amigables.
     */
    const getFriendlyErrorMessage = (errorCode: string): string => {
        switch (errorCode) {
            case "auth/user-not-found":
            case "auth/wrong-password":
                return "Credenciales incorrectas. Verifica tu email y contraseña.";
            case "auth/invalid-email":
                return "El formato del email es inválido.";
            case "auth/too-many-requests":
                return "Demasiados intentos fallidos. Inténtalo más tarde.";
            case "auth/network-request-failed":
                return "Error de red. Verifica tu conexión a internet.";
            default:
                return "Error al iniciar sesión. Por favor, revisa tus credenciales.";
        }
    };

    return (
        <IonCard className="ion-padding">
            <IonCardHeader>
                <IonCardTitle>Iniciar Sesión</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
                <form onSubmit={handleLogin}>
                    <IonList>
                        <IonItem>
                            <IonLabel position="floating">Email</IonLabel>
                            <IonInput
                                type="email"
                                value={email}
                                onIonChange={(e) => setEmail(e.detail.value!)}
                                required
                                disabled={isSubmitting}
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="floating">Contraseña</IonLabel>
                            <IonInput
                                type="password"
                                value={password}
                                onIonChange={(e) => setPassword(e.detail.value!)}
                                required
                                disabled={isSubmitting}
                            />
                        </IonItem>
                    </IonList>

                    <IonButton
                        expand="block"
                        type="submit"
                        className="ion-margin-top"
                        disabled={isSubmitting || !email || !password} // Deshabilitar si no hay datos
                    >
                        {isSubmitting ? "Iniciando..." : "Entrar"}
                    </IonButton>
                </form>

                {/* IonLoading se usa como indicador de proceso, no es un modal bloqueante */}
                <IonLoading
                    isOpen={isSubmitting}
                    message={"Autenticando..."}
                    duration={0}
                />
            </IonCardContent>
        </IonCard>
    );
};

export default LoginForm;