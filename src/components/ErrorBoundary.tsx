import React, { Component, ErrorInfo, ReactNode } from "react";
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from '@ionic/react';
import { warningOutline } from 'ionicons/icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Puedes también enviar el error a un servicio de registro de errores (ej. Sentry)
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <IonContent className="ion-padding">
          <IonCard color="danger">
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={warningOutline} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                ¡Ocurrió un error!
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>Lo sentimos, un error inesperado ha ocurrido en la aplicación.</p>
              <p>Por favor, intenta recargar la aplicación o contacta al soporte si el problema persiste.</p>
              {/* Opcional: Mostrar información de debug solo en desarrollo */}
              {/* <pre>{this.state.errorDetails}</pre> */}
            </IonCardContent>
          </IonCard>
        </IonContent>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;