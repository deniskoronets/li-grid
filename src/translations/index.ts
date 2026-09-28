import {GridTranslation} from "../types";
import {liGridEnTranslation} from "./en";
import {liGridUkTranslation} from "./uk";

/**
 * @todo: add more translations
 */
export const resolveTranslation = (langIso2OrTranslation: string | GridTranslation): GridTranslation => {
    if (typeof langIso2OrTranslation == 'string') {
        switch (langIso2OrTranslation) {
            case 'en':
                return liGridEnTranslation;
            case 'uk':
                return liGridUkTranslation;
            default:
                throw new Error('Unknown translation: ' + langIso2OrTranslation);
        }
    }

    return langIso2OrTranslation;
}
