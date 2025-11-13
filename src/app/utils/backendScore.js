import { apiFetch } from "@/app/utils/apiClient";
import { encryptBackendData } from "./encrypt_decrypt";
export const scoreIncrementBackend = async (
  gameType,
  usertoken,
  pointsToIncrease
) => {
  const pckgTime = Date.now();
  const hash = localStorage.getItem("hash");
  const response = await apiFetch("/api/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${usertoken}`,
    },
    body: JSON.stringify({
      data: encryptBackendData(
        JSON.stringify({
          pointsToIncrease,
          gameType,
          pckgTime,
          hash,
        })
      ),
    }),
  });
  const data = await response.json();
  return data;
};

export const sendHashToBackend = async (usertoken) => {
  const hash = Math.floor(1000 + Math.random() * 9000);
  localStorage.setItem("hash", hash);
  const response = apiFetch(`/api/sync?code=${hash}`, {
    headers: {
      Authorization: `Bearer ${usertoken}`,
    },
  });
  return response;
};
