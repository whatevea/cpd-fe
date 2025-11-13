import Pusher from "pusher-js";
import { PUSHER_KEY, PUSHER_CLUSTER } from "@/app/config/env";

const pusher = new Pusher(PUSHER_KEY || "0c010259d4cfc687630c", {
  cluster: PUSHER_CLUSTER || "mt1",
});

export default pusher;
