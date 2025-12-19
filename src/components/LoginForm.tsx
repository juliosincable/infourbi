import React, { useState } from "react";
import {
  IonButton, IonCard, IonCardHeader, IonTitle, IonCardContent,
  useIonToast, IonSpinner, useIonRouter
} from "@ionic/react";
import { useAuth } from "../context/AuthProvider";

interface FirebaseError {
  code?: string;
}

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auth = useAuth();
  const router = useIonRouter(); // Esto es lo que usaremos para navegar
  const [presentToast] = useIonToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      presentToast({
        message: "Por favor, completa ambos campos",
        duration: 3000,
        color: "warning",
        position: "bottom"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await auth.login(email.trim(), password);
      console.log("¡Éxito!");
      
      // CAMBIO CLAVE: Navegamos sin recargar la página
      router.push("/tabs/home", "forward", "replace");

    } catch (err) {
      const error = err as FirebaseError;
      presentToast({
        message: "Error de acceso: " + (error.code || "verifique sus datos"),
        duration: 3000,
        color: "danger",
        position: "bottom"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonTitle className="ion-text-center">infoUrbi</IonTitle>
      </IonCardHeader>
      <IonCardContent>
        <form onSubmit={handleLogin}>
          <div style={{ padding: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: 'gray' }}>Correo Electrónico</label>
            <input 
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', color: 'black' }}
              placeholder="tu@correo.com"
            />

            <label style={{ display: 'block', marginBottom: '5px', color: 'gray' }}>Contraseña</label>
            <input 
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', color: 'black' }}
            />
          </div>

          <IonButton expand="block" type="submit" disabled={isSubmitting} className="ion-margin-top">
            {isSubmitting ? <IonSpinner name="crescent" /> : "ENTRAR"}
          </IonButton>
        </form>
      </IonCardContent>
    </IonCard>
  );
};

export default LoginForm;