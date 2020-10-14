import SendBird from "sendbird";
import { SENDBIRD_APP_ID } from "@env";

export const sb = new SendBird({ appId: SENDBIRD_APP_ID });
