/**
 * Sanskrit names used by the panchang card. NOT YET REVIEWED BY A SANSKRIT SCHOLAR (see docs/CONTENT-REVIEW.md).
 * Glosses are given only where they are plain and well established (weekdays, ordinal tithi names, the two
 * pakṣas); no etymologies are attached to the 27 nakṣatras or 27 yogas.
 */

export interface Term {
  dev: string;
  iast: string;
  /** A short English gloss, when one is certain. */
  gloss?: string;
}

const t = (dev: string, iast: string, gloss?: string): Term => ({ dev, iast, gloss });

/** Index 0 = Sunday (JavaScript's getUTCDay order). */
export const VARAS: readonly Term[] = [
  t("रविवासरः", "ravivāsaraḥ", "day of the Sun (ravi)"),
  t("सोमवासरः", "somavāsaraḥ", "day of the Moon (soma)"),
  t("मङ्गलवासरः", "maṅgalavāsaraḥ", "day of Mars (maṅgala)"),
  t("बुधवासरः", "budhavāsaraḥ", "day of Mercury (budha)"),
  t("गुरुवासरः", "guruvāsaraḥ", "day of Jupiter, the teacher (guru)"),
  t("शुक्रवासरः", "śukravāsaraḥ", "day of Venus (śukra)"),
  t("शनिवासरः", "śanivāsaraḥ", "day of Saturn (śani)"),
];

/** Tithi names 1–14 are shared by both pakṣas; the 15th is pūrṇimā (waxing) or amāvāsyā (waning). */
const TITHI_NAMES: readonly Term[] = [
  t("प्रतिपदा", "pratipadā", "first"),
  t("द्वितीया", "dvitīyā", "second"),
  t("तृतीया", "tṛtīyā", "third"),
  t("चतुर्थी", "caturthī", "fourth"),
  t("पञ्चमी", "pañcamī", "fifth"),
  t("षष्ठी", "ṣaṣṭhī", "sixth"),
  t("सप्तमी", "saptamī", "seventh"),
  t("अष्टमी", "aṣṭamī", "eighth"),
  t("नवमी", "navamī", "ninth"),
  t("दशमी", "daśamī", "tenth"),
  t("एकादशी", "ekādaśī", "eleventh"),
  t("द्वादशी", "dvādaśī", "twelfth"),
  t("त्रयोदशी", "trayodaśī", "thirteenth"),
  t("चतुर्दशी", "caturdaśī", "fourteenth"),
];
export const PURNIMA = t("पूर्णिमा", "pūrṇimā", "full moon");
export const AMAVASYA = t("अमावास्या", "amāvāsyā", "new moon");

export const SHUKLA = t("शुक्लपक्षः", "śukla-pakṣaḥ", "the bright fortnight, as the Moon waxes");
export const KRISHNA = t("कृष्णपक्षः", "kṛṣṇa-pakṣaḥ", "the dark fortnight, as the Moon wanes");

/** The tithi for number 1..30 (1–15 śukla pakṣa, 16–30 kṛṣṇa pakṣa). */
export function tithiTerm(n: number): Term {
  if (n === 15) return PURNIMA;
  if (n === 30) return AMAVASYA;
  return TITHI_NAMES[(n - 1) % 15];
}
export const pakshaTerm = (n: number): Term => (n <= 15 ? SHUKLA : KRISHNA);
/** Position within its pakṣa, 1..15. */
export const tithiInPaksha = (n: number): number => ((n - 1) % 15) + 1;

/** The 27 nakṣatras, in order from Aśvinī. */
export const NAKSHATRAS: readonly Term[] = [
  t("अश्विनी", "aśvinī"), t("भरणी", "bharaṇī"), t("कृत्तिका", "kṛttikā"), t("रोहिणी", "rohiṇī"),
  t("मृगशिरा", "mṛgaśirā"), t("आर्द्रा", "ārdrā"), t("पुनर्वसु", "punarvasu"), t("पुष्य", "puṣya"),
  t("आश्लेषा", "āśleṣā"), t("मघा", "maghā"), t("पूर्व फल्गुनी", "pūrva phalgunī"), t("उत्तर फल्गुनी", "uttara phalgunī"),
  t("हस्त", "hasta"), t("चित्रा", "citrā"), t("स्वाती", "svātī"), t("विशाखा", "viśākhā"),
  t("अनुराधा", "anurādhā"), t("ज्येष्ठा", "jyeṣṭhā"), t("मूल", "mūla"), t("पूर्वाषाढा", "pūrvāṣāḍhā"),
  t("उत्तराषाढा", "uttarāṣāḍhā"), t("श्रवण", "śravaṇa"), t("धनिष्ठा", "dhaniṣṭhā"), t("शतभिषा", "śatabhiṣā"),
  t("पूर्व भाद्रपदा", "pūrva bhādrapadā"), t("उत्तर भाद्रपदा", "uttara bhādrapadā"), t("रेवती", "revatī"),
];

/** The 27 yogas, in order from Viṣkambha. */
export const YOGAS: readonly Term[] = [
  t("विष्कम्भ", "viṣkambha"), t("प्रीति", "prīti"), t("आयुष्मान्", "āyuṣmān"), t("सौभाग्य", "saubhāgya"),
  t("शोभन", "śobhana"), t("अतिगण्ड", "atigaṇḍa"), t("सुकर्मा", "sukarmā"), t("धृति", "dhṛti"),
  t("शूल", "śūla"), t("गण्ड", "gaṇḍa"), t("वृद्धि", "vṛddhi"), t("ध्रुव", "dhruva"),
  t("व्याघात", "vyāghāta"), t("हर्षण", "harṣaṇa"), t("वज्र", "vajra"), t("सिद्धि", "siddhi"),
  t("व्यतीपात", "vyatīpāta"), t("वरीयान्", "varīyān"), t("परिघ", "parigha"), t("शिव", "śiva"),
  t("सिद्ध", "siddha"), t("साध्य", "sādhya"), t("शुभ", "śubha"), t("शुक्ल", "śukla"),
  t("ब्रह्म", "brahma"), t("इन्द्र", "indra"), t("वैधृति", "vaidhṛti"),
];

/** The 7 repeating karaṇas (Bava … Viṣṭi), then the 4 fixed ones. */
const MOVABLE_KARANAS: readonly Term[] = [
  t("बव", "bava"), t("बालव", "bālava"), t("कौलव", "kaulava"), t("तैतिल", "taitila"),
  t("गर", "gara"), t("वणिज", "vaṇija"), t("विष्टि", "viṣṭi"),
];
const KIMSTUGHNA = t("किंस्तुघ्न", "kiṃstughna");
const SHAKUNI = t("शकुनि", "śakuni");
const CATUSHPADA = t("चतुष्पाद", "catuṣpāda");
const NAGA = t("नाग", "nāga");

/**
 * The karaṇa for a half-tithi number 1..60 (karaṇa = half a tithi). Number 1 is the fixed kiṃstughna;
 * 2–57 cycle through the seven movable ones eight times; 58, 59, 60 are śakuni, catuṣpāda, nāga.
 */
export function karanaTerm(n: number): Term {
  if (n === 1) return KIMSTUGHNA;
  if (n === 58) return SHAKUNI;
  if (n === 59) return CATUSHPADA;
  if (n === 60) return NAGA;
  return MOVABLE_KARANAS[(n - 2) % 7];
}
