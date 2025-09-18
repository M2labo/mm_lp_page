import { Amplify } from "aws-amplify";
import amplifyConfiguration from "../amplifyconfiguration.json"; // あなたのJSON

export function configureAmplify() {
  Amplify.configure(amplifyConfiguration);
}