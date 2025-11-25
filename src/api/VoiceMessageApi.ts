import { Alert } from 'react-native';

const BASE_URL = "https://prelabial-lustrously-michaela.ngrok-free.dev/api";

export const sendVoiceMessageToApi = async (uri: string) => {
  try {
    const formData = new FormData();
    formData.append("voice", {
      uri: uri,
      name: "voice_message.opus",
      type: "audio/opus",
    } as any); // Type assertion for React Native FormData

    const response = await fetch(`${BASE_URL}/chats/voice/test`, {
      method: "POST",
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      // If not successful, get the response body as text for debugging
      const errorText = await response.text();
      console.error("Backend error response:", errorText);
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    // Check the content type to see if it's JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      return await response.json();
    } else {
      // If not JSON, get the response as text
      const responseText = await response.text();
      console.log("Backend response (not JSON):", responseText);
      // Decide what to do with a non-JSON response. 
      // For now, we'll return it as is or throw an error.
      throw new Error('Received non-JSON response from server.');
    }
  } catch (err) {
    console.error("Error sending voice message to backend:", err);
    Alert.alert("错误", "发送语音消息失败，请查看控制台日志了解详情。");
    throw err; // Re-throw the error to be caught in the component
  }
};
