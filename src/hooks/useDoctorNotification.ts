// src/hooks/useDoctorNotification.ts
import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { AxiosError } from "axios";

// Kiểu dữ liệu thông báo lịch hẹn
export interface AppointmentNotificationData {
  patient: { id: number };
  doctor: { id: number };
  appointmentDate: string;
  patientNote: string;
  doctorNote: string;
  clinicRoom: string;
  appointmentType: string;
  notificationSent: boolean;
}

interface UseDoctorNotificationOptions {
  doctorId: number | null;
  onMessage: (data: AppointmentNotificationData | string) => void;
  enabled?: boolean;
}

export default function useDoctorNotification({
  doctorId,
  onMessage,
  enabled = true,
}: UseDoctorNotificationOptions) {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!doctorId || !enabled) return;

    // Lấy token từ localStorage (hoặc nơi bạn lưu token)
    // const token =
    //   typeof window !== "undefined" ? localStorage.getItem("access_token") : "";
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws";
    const socket = new SockJS(`${wsUrl}`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log(">>> [FE] Subscribing doctorId:", doctorId);
      client.subscribe(`/topic/doctor/${doctorId}`, (message) => {
        try {
          const data: AppointmentNotificationData = JSON.parse(message.body);
          console.log(">>> [FE] Nhận message từ BE:", data);
          onMessage(data);
        } catch (error) {
          const err = error as AxiosError<ErrorResponse>;
          console.error(">>> [FE] Lỗi parse message:", message.body, err);
          // fallback nếu không phải JSON
          onMessage(message.body);
          console.error("❌ Error parsing WebSocket message:", err);
        }
      });
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId, enabled]);
}
