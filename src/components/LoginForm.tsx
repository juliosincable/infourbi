import React, { useState } from 'react';
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
  IonAlert,
} from '@ionic/react';
// Importamos el tipo FirebaseError para tipar los errores del catch
import { FirebaseError } from 'firebase/app'; 
import { useAuth } from '../context/AuthContext'; 
import { useHistory } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const history = useHistory();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      history.push('/profile');
    } catch (err) { // <--- ELIMINAMOS 'any' DEL CATCH
      // 1. Verificamos si es una instancia de FirebaseError
      if (err instanceof FirebaseError) {
        console.error("Error de inicio de sesión:", err);
        setError(getFriendlyErrorMessage(err.code));
      } else if (err instanceof Error) {
        // 2. Para otros errores estándar de JS
        setError(err.message);
      } else {
        setError('Ocurrió un error desconocido al iniciar sesión.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Función utilitaria para traducir códigos de error de Firebase a mensajes amigables.
   */
  const getFriendlyErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado. Verifica tu email.';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta.';
      case 'auth/invalid-email':
        return 'El formato del email es inválido.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Inténtalo más tarde.';
      default:
        return 'Error al iniciar sesión. Por favor, revisa tus credenciales.';
    }
  };

  return (
    <IonCard className="ion-padding">
      <IonCardHeader>
        <IonCardTitle>Iniciar Sesión</IonCardTitle>
      </IonCardHeader>
      
      <IonCardContent>
        <IonAlert
          isOpen={!!error}
          onDidDismiss={() => setError(null)}
          header={'Error de Autenticación'}
          message={error || ''}
          buttons={['OK']}
        />

        <form onSubmit={handleLogin}>
          <IonList>
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonChange={e => setEmail(e.detail.value!)}
                required
                disabled={isSubmitting}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Contraseña</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonChange={e => setPassword(e.detail.value!)}
                required
                disabled={isSubmitting}
              />
            </IonItem>
          </IonList>
          
          <IonButton 
            expand="block" 
            type="submit" 
            className="ion-margin-top"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Iniciando...' : 'Entrar'}
          </IonButton>

          <IonLoading
            isOpen={isSubmitting}
            message={'Autenticando...'}
            duration={0}
          />
        </form>
      </IonCardContent>
    </IonCard>
  );
};

export default LoginForm;

// CÓDIGO IMPLEMENTADO EN EL ARCHIVO COMPLETO: src/components/LoginForm.tsx