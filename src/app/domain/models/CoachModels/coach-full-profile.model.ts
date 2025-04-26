import { Coachcertficate } from "./coachcertficate.model";
import { Coachportfolio } from "./coachportfolio.model";
import { Coachrating } from "./coachrating.model";
import { Coachworksample } from "./coachworksample.model";

export class CoachFullProfile {
    portfolio !: Coachportfolio;
    certificates!: Coachcertficate[];
    workSamples !: Coachworksample[];
    ratings !: Coachrating[];
}
