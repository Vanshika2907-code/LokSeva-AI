import { LanguageCode } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';

// Indic numeral digit mappings
export const DIGIT_MAPS: Record<LanguageCode, string[]> = {
  kn: ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'],
  hi: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  ta: ['௦', '௧', '௨', '௩', '௪', '௫', '௬', '௭', '௮', '௯'],
  te: ['౦', '౧', '౨', '౩', '౪', '౫', '౬', '౭', '౮', '౯'],
  ml: ['൦', '൧', '൨', '൩', '൪', '൫', '൬', '൭', '൮', '൯'],
  mr: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
  bn: ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'],
  gu: ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'],
  en: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
};

const COMMON_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  howCanWeHelp: {
    kn: 'ಇಂದು ನಾವು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?', hi: 'आज हम आपकी कैसे सहायता कर सकते हैं?', ta: 'இன்று நாங்கள் உங்களுக்கு எப்படி உதவலாம்?',
    te: 'ఈ రోజు మేము మీకు ఎలా సహాయం చేయலாம்?', ml: 'ഇന്ന് ഞങ്ങൾക്ക് നിങ്ങളെ എങ്ങനെ സഹായിക്കാം?', mr: 'आज आम्ही आपली कशी मदत करू शकतो?',
    bn: 'আজ আমরা কীভাবে আপনাকে সাহায্য করতে পারি?', gu: 'આજે અમે તમને કેવી રીતે મદદ કરી શકીએ?', en: 'How Can We Help You Today?',
  },
  citizenHelpline: {
    kn: 'ನಾಗರಿಕ ಸಹಾಯವಾಣಿ', hi: 'नागरिक हेल्पलाइन', ta: 'குடிமக்கள் உதவி எண்', te: 'పౌర హెల్ప్‌లైన్',
    ml: 'പൗര ഹെൽപ്‌ലൈൻ', mr: 'नागरिक हेल्पलाइन', bn: 'নাগরিক হেল্পলাইন', gu: 'નાગરિક હેલ્પલાઇન', en: 'Citizen Helpline',
  },
  filterAllDepts: {
    kn: 'ಎಲ್ಲಾ', hi: 'सभी', ta: 'அனைத்தும்', te: 'అన్నీ', ml: 'എല്ലാം', mr: 'सर्व', bn: 'সব', gu: 'બધા', en: 'All',
  },
  voiceInput: {
    kn: 'ಧ್ವನಿ ಇನ್‌ಪುಟ್', hi: 'वॉइस इनपुट', ta: 'குரல் உள்ளீடு', te: 'వాయిస్ ఇన్‌పుట్', ml: 'വോയ്സ് ഇൻപുട്ട്', mr: 'व्हॉइस इनपुट', bn: 'ভয়েস ইনপুট', gu: 'વૉઇસ ઇનપુટ', en: 'Voice Input',
  },
  selectLanguage: {
    kn: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ', hi: 'भाषा चुनें', ta: 'மொழியைத் தேர்ந்தெடுக்கவும்', te: 'భాషను ఎంచుకోండి', ml: 'ഭാഷ തിരഞ്ഞെടുക്കുക', mr: 'भाषा निवडा', bn: 'ভাষা নির্বাচন করুন', gu: 'ભાષા પસંદ કરો', en: 'Select Language',
  },
  analyzeWithAI: {
    kn: 'AI ಮೂಲಕ ವಿಶ್ಲೇಷಿಸಿ', hi: 'AI से विश्लेषण करें', ta: 'AI மூலம் பகுப்பாய்வு செய்யவும்', te: 'AIతో విశ్లేషించండి', ml: 'AI ഉപയോഗിച്ച് വിശകലനം ചെയ്യുക', mr: 'AI द्वारे विश्लेषण करा', bn: 'AI দিয়ে বিশ্লেষণ করুন', gu: 'AI વડે વિશ્લેષણ કરો', en: 'Analyze with AI',
  },
  listening: {
    kn: 'ಆಲಿಸಲಾಗುತ್ತಿದೆ', hi: 'सुन रहा है', ta: 'கேட்கிறது', te: 'వింటోంది', ml: 'കേൾക്കുന്നു', mr: 'ऐकत आहे', bn: 'শোনা হচ্ছে', gu: 'સાંભળી રહ્યા છીએ', en: 'Listening',
  },
  evidencePhoto: {
    kn: 'ಸಾಕ್ಷ್ಯ ಫೋಟೋ', hi: 'प्रमाण फोटो', ta: 'ஆதாரப் புகைப்படம்', te: 'సాక్ష్య ఫోటో', ml: 'തെളിവ് ഫോട്ടോ', mr: 'पुरावा फोटो', bn: 'প্রমাণের ছবি', gu: 'પુરાવાનો ફોટો', en: 'Evidence Photo',
  },
  attachPhoto: {
    kn: 'ಫೋಟೋ ಸೇರಿಸಿ', hi: 'फोटो जोड़ें', ta: 'புகைப்படத்தை இணைக்கவும்', te: 'ఫోటోను జతచేయండి', ml: 'ഫോട്ടോ ചേർക്കുക', mr: 'फोटो जोडा', bn: 'ছবি সংযুক্ত করুন', gu: 'ફોટો જોડો', en: 'Attach Photo',
  },
  removePhoto: {
    kn: 'ಫೋಟೋ ತೆಗೆದುಹಾಕಿ', hi: 'फोटो हटाएं', ta: 'புகைப்படத்தை அகற்றவும்', te: 'ఫోటోను తొలగించండి', ml: 'ഫോട്ടോ നീക്കം ചെയ്യുക', mr: 'फोटो काढा', bn: 'ছবি সরান', gu: 'ફોટો દૂર કરો', en: 'Remove Photo',
  },
  location: {
    kn: 'ಸ್ಥಳ', hi: 'स्थान', ta: 'இடம்', te: 'స్థానం', ml: 'സ്ഥലം', mr: 'ठिकाण', bn: 'অবস্থান', gu: 'સ્થળ', en: 'Location',
  },
  ward: {
    kn: 'ವಾರ್ಡ್', hi: 'वार्ड', ta: 'வார்டு', te: 'వార్డు', ml: 'വാർഡ്', mr: 'प्रभाग', bn: 'ওয়ার্ড', gu: 'વોર્ડ', en: 'Ward',
  },
  manualLocation: {
    kn: 'ಸ್ಥಳದ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ', hi: 'स्थान का पता दर्ज करें', ta: 'இட முகவரியை உள்ளிடவும்', te: 'స్థల చిరునామాను నమోదు చేయండి',
    ml: 'സ്ഥല വിലാസം നൽകുക', mr: 'ठिकाणाचा पत्ता भरा', bn: 'অবস্থানের ঠিকানা লিখুন', gu: 'સ્થળનું સરનામું દાખલ કરો', en: 'Enter location manually',
  },
  manualWard: {
    kn: 'ವಾರ್ಡ್ ನಮೂದಿಸಿ', hi: 'वार्ड दर्ज करें', ta: 'வார்டை உள்ளிடவும்', te: 'వార్డును నమోదు చేయండి',
    ml: 'വാർഡ് നൽകുക', mr: 'प्रभाग भरा', bn: 'ওয়ার্ড লিখুন', gu: 'વોર્ડ દાખલ કરો', en: 'Enter ward manually',
  },
  voiceUnsupported: {
    kn: 'ಈ ಬ್ರೌಸರ್ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆಯನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ. ದಯವಿಟ್ಟು Chrome ಬಳಸಿ ಅಥವಾ ದೂರನ್ನು ಟೈಪ್ ಮಾಡಿ.', hi: 'यह ब्राउज़र आवाज़ पहचान का समर्थन नहीं करता। Chrome का उपयोग करें या शिकायत टाइप करें।', ta: 'இந்த உலாவி குரல் அடையாளத்தை ஆதரிக்கவில்லை. Chrome பயன்படுத்தவும் அல்லது புகாரைத் தட்டச்சு செய்யவும்.', te: 'ఈ బ్రౌజర్ వాయిస్ గుర్తింపును మద్దతు ఇవ్వదు. Chrome ఉపయోగించండి లేదా ఫిర్యాదును టైప్ చేయండి.',
    ml: 'ഈ ബ്രൗസർ ശബ്ദ തിരിച്ചറിയൽ പിന്തുണയ്ക്കുന്നില്ല. Chrome ഉപയോഗിക്കുക അല്ലെങ്കിൽ പരാതി ടൈപ്പ് ചെയ്യുക.', mr: 'हा ब्राउझर आवाज ओळखण्यास समर्थन देत नाही. Chrome वापरा किंवा तक्रार टाइप करा.', bn: 'এই ব্রাউজার ভয়েস শনাক্তকরণ সমর্থন করে না। Chrome ব্যবহার করুন বা অভিযোগ টাইপ করুন।', gu: 'આ બ્રાઉઝર વૉઇસ ઓળખને સપોર્ટ કરતું નથી. Chrome વાપરો અથવા ફરિયાદ ટાઇપ કરો.', en: 'Voice input is not supported in this browser. Use Chrome or type your grievance.',
  },
  voicePermissionDenied: {
    kn: 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ಅಗತ್ಯವಿದೆ. ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿಸಿ ಮತ್ತು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.', hi: 'माइक्रोफ़ोन की अनुमति आवश्यक है। ब्राउज़र सेटिंग में माइक्रोफ़ोन की अनुमति दें और फिर प्रयास करें।', ta: 'மைக்ரோஃபோன் அனுமதி தேவை. உலாவி அமைப்புகளில் அனுமதித்து மீண்டும் முயற்சிக்கவும்.', te: 'మైక్రోఫోన్ అనుమతి అవసరం. బ్రౌజర్ సెట్టింగ్‌లలో అనుమతించి మళ్లీ ప్రయత్నించండి.',
    ml: 'മൈക്രോഫോൺ അനുമതി ആവശ്യമാണ്. ബ്രൗസർ ക്രമീകരണങ്ങളിൽ അനുമതി നൽകി വീണ്ടും ശ്രമിക്കുക.', mr: 'मायक्रोफोन परवानगी आवश्यक आहे. ब्राउझर सेटिंग्जमध्ये परवानगी देऊन पुन्हा प्रयत्न करा.', bn: 'মাইক্রোফোনের অনুমতি প্রয়োজন। ব্রাউজার সেটিংসে অনুমতি দিয়ে আবার চেষ্টা করুন।', gu: 'માઇક્રોફોનની પરવાનગી જરૂરી છે. બ્રાઉઝર સેટિંગ્સમાં પરવાનગી આપીને ફરી પ્રયાસ કરો.', en: 'Microphone permission is required. Allow it in your browser settings and try again.',
  },
  voiceNoSpeech: {
    kn: 'ಯಾವುದೇ ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ಮತ್ತೆ ಮಾತನಾಡಿ ಅಥವಾ ದೂರನ್ನು ಟೈಪ್ ಮಾಡಿ.', hi: 'कोई आवाज़ नहीं मिली। फिर से बोलें या शिकायत टाइप करें।', ta: 'குரல் கேட்கவில்லை. மீண்டும் பேசவும் அல்லது புகாரைத் தட்டச்சு செய்யவும்.', te: 'వాయిస్ వినిపించలేదు. మళ్లీ మాట్లాడండి లేదా ఫిర్యాదును టైప్ చేయండి.',
    ml: 'ശബ്ദം കേൾക്കാനായില്ല. വീണ്ടും സംസാരിക്കുക അല്ലെങ്കിൽ പരാതി ടൈപ്പ് ചെയ്യുക.', mr: 'आवाज ऐकू आली नाही. पुन्हा बोला किंवा तक्रार टाइप करा.', bn: 'কোনও আওয়াজ পাওয়া যায়নি। আবার বলুন বা অভিযোগ টাইপ করুন।', gu: 'કોઈ અવાજ મળ્યો નથી. ફરી બોલો અથવા ફરિયાદ ટાઇપ કરો.', en: 'No speech was detected. Speak again or type your grievance.',
  },
  voiceTryAgain: {
    kn: 'ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಪ್ರಾರಂಭಿಸಲಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ದೂರನ್ನು ಟೈಪ್ ಮಾಡಿ.', hi: 'वॉइस इनपुट शुरू नहीं हो सका। फिर प्रयास करें या शिकायत टाइप करें।', ta: 'குரல் உள்ளீட்டைத் தொடங்க முடியவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது புகாரைத் தட்டச்சு செய்யவும்.', te: 'వాయిస్ ఇన్‌పుట్ ప్రారంభం కాలేదు. మళ్లీ ప్రయత్నించండి లేదా ఫిర్యాదును టైప్ చేయండి.',
    ml: 'വോയ്സ് ഇൻപുട്ട് ആരംഭിക്കാനായില്ല. വീണ്ടും ശ്രമിക്കുക അല്ലെങ്കിൽ പരാതി ടൈപ്പ് ചെയ്യുക.', mr: 'व्हॉइस इनपुट सुरू करता आले नाही. पुन्हा प्रयत्न करा किंवा तक्रार टाइप करा.', bn: 'ভয়েস ইনপুট শুরু করা যায়নি। আবার চেষ্টা করুন বা অভিযোগ টাইপ করুন।', gu: 'વૉઇસ ઇનપુટ શરૂ થઈ શક્યું નથી. ફરી પ્રયાસ કરો અથવા ફરિયાદ ટાઇપ કરો.', en: 'Voice input could not start. Try again or type your grievance.',
  },
  voiceAudioFallback: {
    kn: 'ಧ್ವನಿ ರೆಕಾರ್ಡ್ ಆಗುತ್ತಿದೆ. ಮುಗಿದ ನಂತರ ನಿಲ್ಲಿಸಿ ಮತ್ತು AI ಮೂಲಕ ವಿಶ್ಲೇಷಿಸಿ.', hi: 'आवाज़ रिकॉर्ड हो रही है। पूरा होने पर रोकें और AI से विश्लेषण करें।', ta: 'குரல் பதிவு செய்யப்படுகிறது. முடிந்ததும் நிறுத்தி AI மூலம் பகுப்பாய்வு செய்யவும்.', te: 'వాయిస్ రికార్డ్ అవుతోంది. పూర్తయిన తర్వాత ఆపి AIతో విశ్లేషించండి.',
    ml: 'ശബ്ദം റെക്കോർഡ് ചെയ്യുന്നു. പൂർത്തിയായാൽ നിർത്തി AI ഉപയോഗിച്ച് വിശകലനം ചെയ്യുക.', mr: 'आवाज रेकॉर्ड होत आहे. पूर्ण झाल्यावर थांबवून AI द्वारे विश्लेषण करा.', bn: 'ভয়েস রেকর্ড হচ্ছে। শেষ হলে থামিয়ে AI দিয়ে বিশ্লেষণ করুন।', gu: 'વૉઇસ રેકોર્ડ થઈ રહ્યો છે. પૂર્ણ થયા પછી રોકો અને AI વડે વિશ્લેષણ કરો.', en: 'Voice is being recorded. Stop when finished, then analyze with AI.',
  },
};

/**
 * Converts any number (e.g. 42 or 98.5) to the target language's native script digits.
 */
export function locNum(num: number | string | undefined | null, lang: LanguageCode | string = 'en'): string {
  if (num === undefined || num === null) return '';
  const str = String(num);
  const code = (lang || 'en') as LanguageCode;
  if (code === 'en') return str;
  const digits = DIGIT_MAPS[code] || DIGIT_MAPS.en;
  return str.replace(/[0-9]/g, (d) => digits[parseInt(d, 10)]);
}

/**
 * Scans any string and replaces all Arabic numerals (0-9) with localized script numerals.
 */
export function localizeDigitsInString(text: string | undefined | null, lang: LanguageCode | string = 'en'): string {
  if (!text) return '';
  const code = (lang || 'en') as LanguageCode;
  if (code === 'en') return text;
  const digits = DIGIT_MAPS[code] || DIGIT_MAPS.en;
  return text.replace(/[0-9]/g, (d) => digits[parseInt(d, 10)]);
}

/**
 * Retrieves a translated string from the dictionary or falls back to English / key.
 * Also automatically localizes any embedded digits in the translated text.
 */
export function t(key: string, lang: LanguageCode | string = 'en', fallback?: string): string {
  const code = (lang || 'en') as LanguageCode;
  const dict = UI_TRANSLATIONS[code] || UI_TRANSLATIONS.en;
  const val = dict[key] || COMMON_TRANSLATIONS[key]?.[code] || UI_TRANSLATIONS.en[key] || fallback || key;
  return localizeDigitsInString(val, code);
}

// Category Localization Mapping
export const CATEGORY_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  'Roads & Infrastructure': {
    kn: 'ರಸ್ತೆ ಮತ್ತು ಮೂಲಸೌಕರ್ಯ',
    hi: 'सड़क एवं बुनियादी ढांचा',
    ta: 'சாலை & உள்கட்டமைப்பு',
    te: 'రోడ్లు & మౌలిక సదుపాయాలు',
    ml: 'റോഡുകളും അടിസ്ഥാന സൗകര്യങ്ങളും',
    mr: 'रस्ते व पायाभूत सुविधा',
    bn: 'রাস্তা ও অবকাঠামো',
    gu: 'રસ્તા અને ઇન્ફ્રાસ્ટ્રક્ચર',
    en: 'Roads & Infrastructure',
  },
  'Water Supply & Drainage': {
    kn: 'ಕುಡಿಯುವ ನೀರು ಮತ್ತು ಒಳಚರಂಡಿ',
    hi: 'जल आपूर्ति एवं जल निकासी',
    ta: 'குடிநீர் & கழிவுநீர் வடிகால்',
    te: 'నీటి సరఫరా & డ్రైనేజీ',
    ml: 'കുടിവെള്ളവും ഡ്രെയിനേജും',
    mr: 'पाणीपुरवठा व निचरा व्यवस्था',
    bn: 'জল সরবরাহ ও নিকাশী',
    gu: 'પાણી પુરવઠો અને ડ્રેનેજ',
    en: 'Water Supply & Drainage',
  },
  'Water Supply': {
    kn: 'ಕುಡಿಯುವ ನೀರು ಸರಬರಾಜು',
    hi: 'जल आपूर्ति',
    ta: 'குடிநீர் விநியோகம்',
    te: 'నీటి సరఫరా',
    ml: 'കുടിവെള്ള വിതരണം',
    mr: 'पाणीपुरवठा',
    bn: 'জল সরবরাহ',
    gu: 'પાણી પુરવઠો',
    en: 'Water Supply',
  },
  'Electricity': {
    kn: 'ವಿದ್ಯುತ್ ಸರಬರಾಜು',
    hi: 'विद्युत आपूर्ति',
    ta: 'மின்சாரம்',
    te: 'విద్యుత్ సరఫరా',
    ml: 'വൈദ്യുതി',
    mr: 'वीज पुरवठा',
    bn: 'বিদ্যুৎ সরবরাহ',
    gu: 'વીજળી',
    en: 'Electricity',
  },
  'Garbage & Sanitation': {
    kn: 'ಕಸ ವಿಲೇವಾರಿ ಮತ್ತು ನೈರ್ಮಲ್ಯ',
    hi: 'कचरा प्रबंधन एवं स्वच्छता',
    ta: 'குப்பை மேலாண்மை & சுகாதாரம்',
    te: 'చెత్త & పారిశుధ్యం',
    ml: 'മാലിന്യ സംസ്കരണവും ശുചിത്വവും',
    mr: 'कचरा व स्वच्छता',
    bn: 'বর্জ্য ও পরিচ্ছন্নতা',
    gu: 'કચરો અને સ્વચ્છતા',
    en: 'Garbage & Sanitation',
  },
  'Waste Management': {
    kn: 'ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ',
    hi: 'कचरा प्रबंधन',
    ta: 'திடக்கழிவு மேலாண்மை',
    te: 'వ్యర్థాల నిర్వహణ',
    ml: 'മാലിന്യ സംസ്കരണം',
    mr: 'घनकचरा व्यवस्थापन',
    bn: 'বর্জ্য ব্যবস্থাপনা',
    gu: 'કચરા વ્યવસ્થાપન',
    en: 'Waste Management',
  },
  'Sanitation': {
    kn: 'ನೈರ್ಮಲ್ಯ ವ್ಯವಸ್ಥೆ',
    hi: 'स्वच्छता',
    ta: 'சுகாதாரம்',
    te: 'పారిశుధ్యం',
    ml: 'ശുചിത്വം',
    mr: 'स्वच्छता',
    bn: 'পরিচ্ছন্নতা',
    gu: 'સ્વચ્છતા',
    en: 'Sanitation',
  },
  'Drainage': {
    kn: 'ಒಳಚರಂಡಿ ವ್ಯವಸ್ಥೆ',
    hi: 'जल निकासी',
    ta: 'வடிகால்',
    te: 'డ్రైనేజీ',
    ml: 'ഡ്രെയിനേജ്',
    mr: 'निचरा व्यवस्था',
    bn: 'নিকাশী',
    gu: 'ડ્રેનેજ',
    en: 'Drainage',
  },
  'Street Lighting & Electricity': {
    kn: 'ಬೀದಿ ದೀಪಗಳು ಮತ್ತು ವಿದ್ಯುತ್',
    hi: 'स्ट्रीट लाइट एवं बिजली',
    ta: 'தெரு விளக்குகள் & மின்சாரம்',
    te: 'వీధి దీపాలు & విద్యుత్',
    ml: 'തെരുവ് വിളക്കുകളും വൈദ്യുതിയും',
    mr: 'रस्त्यावरील दिवे व वीज',
    bn: 'পথবাতি ও বিদ্যুৎ',
    gu: 'શેરી લાઇટ અને વીજળી',
    en: 'Street Lighting & Electricity',
  },
  'Street Lighting': {
    kn: 'ಬೀದಿ ದೀಪಗಳು',
    hi: 'स्ट्रीट लाइट',
    ta: 'தெரு விளக்குகள்',
    te: 'వీధి దీపాలు',
    ml: 'തെരുവ് വിളക്കുകൾ',
    mr: 'रस्त्यावरील दिवे',
    bn: 'পথবাতি',
    gu: 'શેરી લાઇટો',
    en: 'Street Lighting',
  },
  'Public Health & Safety': {
    kn: 'ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ ಮತ್ತು ಸುರಕ್ಷತೆ',
    hi: 'सार्वजनिक स्वास्थ्य एवं सुरक्षा',
    ta: 'பொது சுகாதாரம் & பாதுகாப்பு',
    te: 'ప్రజారోగ్యం & భద్రత',
    ml: 'പൊതുജനാരോഗ്യവും സുരക്ഷയും',
    mr: 'सार्वजनिक आरोग्य व सुरक्षा',
    bn: 'জনস্বাস্থ্য ও নিরাপত্তা',
    gu: 'જાહેર આરોગ્ય અને સુરક્ષા',
    en: 'Public Health & Safety',
  },
  'Public Health': {
    kn: 'ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ',
    hi: 'सार्वजनिक स्वास्थ्य',
    ta: 'பொது சுகாதாரம்',
    te: 'ప్రజారోగ్యం',
    ml: 'പൊതുജനാരോഗ്യം',
    mr: 'सार्वजनिक आरोग्य',
    bn: 'জনস্বাস্থ্য',
    gu: 'જાહેર આરોગ્ય',
    en: 'Public Health',
  },
  'Parks & Environment': {
    kn: 'ಉದ್ಯಾನವನಗಳು ಮತ್ತು ಪರಿಸರ',
    hi: 'पार्क एवं पर्यावरण',
    ta: 'பூங்காக்கள் & சுற்றுச்சூழல்',
    te: 'పార్కులు & పర్యావరణం',
    ml: 'പാർക്കുകളും പരിസ്ഥിതിയും',
    mr: 'उद्याने व पर्यावरण',
    bn: 'পার্ক ও পরিবেশ',
    gu: 'બગીચાઓ અને પર્યાવરણ',
    en: 'Parks & Environment',
  },
  'Other Civic Issues': {
    kn: 'ಇತರ ನಾಗರಿಕ ಸಮಸ್ಯೆಗಳು',
    hi: 'अन्य नागरिक समस्याएं',
    ta: 'பிற குடிமைப் பிரச்சினைகள்',
    te: 'ఇతర పౌర సమస్యలు',
    ml: 'മറ്റ് പൗര പ്രശ്നങ്ങൾ',
    mr: 'इतर नागरी समस्या',
    bn: 'অন্যান্য নাগরিক সমস্যা',
    gu: 'અન્ય નાગરિક સમસ્યાઓ',
    en: 'Other Civic Issues',
  },
};

export function locCategory(cat: string, lang: LanguageCode | string = 'en'): string {
  if (!cat) return '';
  const code = (lang || 'en') as LanguageCode;
  const trans = CATEGORY_TRANSLATIONS[cat];
  if (trans && trans[code]) return trans[code];
  return cat;
}

// Department Localization Mapping
export const DEPARTMENT_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  'Public Works Department': {
    kn: 'ಸಾರ್ವಜನಿಕ ಕಾಮಗಾರಿಗಳ ಇಲಾಖೆ', hi: 'लोक निर्माण विभाग', ta: 'பொதுப்பணித் துறை', te: 'ప్రజా పనుల శాఖ',
    ml: 'പൊതുമരാമത്ത് വകുപ്പ്', mr: 'सार्वजनिक बांधकाम विभाग', bn: 'পূর্ত দপ্তর', gu: 'જાહેર બાંધકામ વિભાગ', en: 'Public Works Department',
  },
  'Road Maintenance Division': {
    kn: 'ರಸ್ತೆ ನಿರ್ವಹಣಾ ವಿಭಾಗ',
    hi: 'सड़क रखरखाव प्रभाग',
    ta: 'சாலை பராமரிப்புப் பிரிவு',
    te: 'రోడ్డు నిర్వహణ విభాగం',
    ml: 'റോഡ് പരിപാലന വിഭാഗം',
    mr: 'रस्ते देखभाल विभाग',
    bn: 'রাস্তা রক্ষণাবেক্ষণ শাখা',
    gu: 'માર્ગ જાળવણી વિભાગ',
    en: 'Road Maintenance Division',
  },
  'Water Supply & Sewerage Board': {
    kn: 'ಜಲಮಂಡಳಿ ಮತ್ತು ಒಳಚರಂಡಿ ಮಂಡಳಿ',
    hi: 'जल आपूर्ति एवं सीवरेज बोर्ड',
    ta: 'குடிநீர் & கழிவுநீர் வாரியம்',
    te: 'నీటి సరఫరా మరియు మురుగునీటి బోర్డు',
    ml: 'വാട്ടർ അതോറിറ്റി & മലിനജല ബോർഡ്',
    mr: 'पाणीपुरवठा व मलनिस्सारण मंडळ',
    bn: 'জল সরবরাহ ও পয়ঃনিষ্কাশন পর্ষদ',
    gu: 'પાણી પુરવઠો અને ગટર બોર્ડ',
    en: 'Water Supply & Sewerage Board',
  },
  'Solid Waste Management': {
    kn: 'ಘನತ್ಯಾಜ್ಯ ನಿರ್ವಹಣಾ ಇಲಾಖೆ',
    hi: 'ठोस अपशिष्ट प्रबंधन विभाग',
    ta: 'திடக்கழிவு மேலாண்மை துறை',
    te: 'ఘన వ్యర్థాల నిర్వహణ',
    ml: 'ഖരമാലിന്യ സംസ്കരണ വിഭാഗം',
    mr: 'घनकचरा व्यवस्थापन विभाग',
    bn: 'কঠিন বর্জ্য ব্যবস্থাপনা',
    gu: 'ઘન કચરા વ્યવસ્થાપન',
    en: 'Solid Waste Management',
  },
  'Electrical & Streetlighting Dept': {
    kn: 'ವಿದ್ಯುತ್ ಮತ್ತು ಬೀದಿದೀಪಗಳ ಇಲಾಖೆ',
    hi: 'विद्युत एवं स्ट्रीट लाइट विभाग',
    ta: 'மின்சாரம் & தெருவிளக்கு துறை',
    te: 'విద్యుత్ & వీధి దీపాల విభాగం',
    ml: 'വൈദ്യുതി & തെരുവ് വിളക്ക് വിഭാഗം',
    mr: 'विद्युत व पथदिवे विभाग',
    bn: 'বিদ্যুৎ ও পথবাতি বিভাগ',
    gu: 'વીજળી અને શેરી લાઈટ વિભાગ',
    en: 'Electrical & Streetlighting Dept',
  },
  'Electricity Supply Corporation': {
    kn: 'ವಿದ್ಯುತ್ ಸರಬರಾಜು ನಿಗಮ', hi: 'विद्युत आपूर्ति निगम', ta: 'மின்சார விநியோக நிறுவனம்', te: 'విద్యుత్ సరఫరా సంస్థ',
    ml: 'വൈദ്യുതി വിതരണ കോർപ്പറേഷൻ', mr: 'वीज पुरवठा महामंडळ', bn: 'বিদ্যুৎ সরবরাহ কর্পোরেশন', gu: 'વીજ પુરવઠા નિગમ', en: 'Electricity Supply Corporation',
  },
  'Sanitation & Health Division': {
    kn: 'ನೈರ್ಮಲ್ಯ ಮತ್ತು ಆರೋಗ್ಯ ವಿಭಾಗ', hi: 'स्वच्छता एवं स्वास्थ्य प्रभाग', ta: 'சுகாதாரம் மற்றும் சுகாதாரப் பிரிவு', te: 'పారిశుధ్య & ఆరోగ్య విభాగం',
    ml: 'ശുചിത്വ ആരോഗ്യ വിഭാഗം', mr: 'स्वच्छता व आरोग्य विभाग', bn: 'স্যানিটেশন ও স্বাস্থ্য বিভাগ', gu: 'સ્વચ્છતા અને આરોગ્ય વિભાગ', en: 'Sanitation & Health Division',
  },
  'Street Lighting Division': {
    kn: 'ಬೀದಿ ದೀಪಗಳ ವಿಭಾಗ', hi: 'स्ट्रीट लाइटिंग प्रभाग', ta: 'தெருவிளக்குப் பிரிவு', te: 'వీధి దీపాల విభాగం',
    ml: 'തെരുവ് വിളക്ക് വിഭാഗം', mr: 'पथदिवे विभाग', bn: 'পথবাতি বিভাগ', gu: 'સ્ટ્રીટ લાઇટિંગ વિભાગ', en: 'Street Lighting Division',
  },
  'Metropolitan Transport Corporation': {
    kn: 'ಮಹಾನಗರ ಸಾರಿಗೆ ನಿಗಮ', hi: 'महानगर परिवहन निगम', ta: 'பெருநகர போக்குவரத்துக் கழகம்', te: 'మహానగర రవాణా సంస్థ',
    ml: 'മെട്രോപൊളിറ്റൻ ഗതാഗത കോർപ്പറേഷൻ', mr: 'महानगर परिवहन महामंडळ', bn: 'মহানগর পরিবহন কর্পোরেশন', gu: 'મહાનગર પરિવહન નિગમ', en: 'Metropolitan Transport Corporation',
  },
  'Public Health & Disease Control': {
    kn: 'ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ ಮತ್ತು ರೋಗ ನಿಯಂತ್ರಣ', hi: 'सार्वजनिक स्वास्थ्य एवं रोग नियंत्रण', ta: 'பொது சுகாதாரம் மற்றும் நோய் கட்டுப்பாடு', te: 'ప్రజారోగ్య & వ్యాధి నియంత్రణ',
    ml: 'പൊതുജനാരോഗ്യവും രോഗ നിയന്ത്രണവും', mr: 'सार्वजनिक आरोग्य व रोग नियंत्रण', bn: 'জনস্বাস্থ্য ও রোগ নিয়ন্ত্রণ', gu: 'જાહેર આરોગ્ય અને રોગ નિયંત્રણ', en: 'Public Health & Disease Control',
  },
  'Municipal Stormwater Drainage': {
    kn: 'ನಗರ ಮಳೆನೀರು ಚರಂಡಿ', hi: 'नगर तूफानी जल निकासी', ta: 'நகர்ப்புற மழைநீர் வடிகால்', te: 'మునిసిపల్ వర్షపు నీటి డ్రైనేజీ',
    ml: 'മുനിസിപ്പൽ മഴവെള്ള ഡ്രെയിനേജ്', mr: 'महानगर पावसाचे पाणी निचरा', bn: 'পৌর ঝড়ের জল নিষ্কাশন', gu: 'મ્યુનિસિપલ વરસાદી પાણી ડ્રેનેજ', en: 'Municipal Stormwater Drainage',
  },
  'Environmental Protection Cell': {
    kn: 'ಪರಿಸರ ಸಂರಕ್ಷಣಾ ಘಟಕ', hi: 'पर्यावरण संरक्षण प्रकोष्ठ', ta: 'சுற்றுச்சூழல் பாதுகாப்புப் பிரிவு', te: 'పర్యావరణ పరిరక్షణ విభాగం',
    ml: 'പരിസ്ഥിതി സംരക്ഷണ സെൽ', mr: 'पर्यावरण संरक्षण कक्ष', bn: 'পরিবেশ সুরক্ষা সেল', gu: 'પર્યાવરણ સંરક્ષણ સેલ', en: 'Environmental Protection Cell',
  },
  'Public Health Dept': {
    kn: 'ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ ಇಲಾಖೆ',
    hi: 'सार्वजनिक स्वास्थ्य विभाग',
    ta: 'பொது சுகாதாரத் துறை',
    te: 'ప్రజారోగ్య విభాగం',
    ml: 'പൊതുജനാരോഗ്യ വിഭാഗം',
    mr: 'सार्वजनिक आरोग्य विभाग',
    bn: 'জনস্বাস্থ্য বিভাগ',
    gu: 'જાહેર આરોગ્ય વિભાગ',
    en: 'Public Health Dept',
  },
  'Horticulture & Parks': {
    kn: 'ತೋಟಗಾರಿಕೆ ಮತ್ತು ಉದ್ಯಾನವನಗಳ ಇಲಾಖೆ',
    hi: 'उद्यानिकी एवं पार्क विभाग',
    ta: 'தோட்டக்கலை & பூங்காக்கள்',
    te: 'ఉద్యానవనాలు & పార్కులు',
    ml: 'ഹോർട്ടികൾച്ചർ & പാർക്കുകൾ',
    mr: 'उद्यानविद्या व उद्याने',
    bn: 'উদ্যানপালন ও উদ্যান',
    gu: 'બાગાયત અને બગીચાઓ',
    en: 'Horticulture & Parks',
  },
  'General Civic Grievances': {
    kn: 'ಸಾಮಾನ್ಯ ನಾಗರಿಕ ಕುಂದುಕೊರತೆಗಳ ವಿಭಾಗ',
    hi: 'सामान्य नागरिक शिकायत प्रकोष्ठ',
    ta: 'பொது குடிமை குறைதீர்ப்பு பிரிவு',
    te: 'సాధారణ పౌర ఫిర్యాదులు',
    ml: 'പൊതു പൗര പരാതി പരിഹാരം',
    mr: 'सामान्य नागरी तक्रार निवारण',
    bn: 'সাধারণ নাগরিক অভিযোগ',
    gu: 'સામાન્ય નાગરિક ફરિયાદો',
    en: 'General Civic Grievances',
  },
};

export function locDepartment(dept: string, lang: LanguageCode | string = 'en'): string {
  if (!dept) return '';
  const code = (lang || 'en') as LanguageCode;
  const trans = DEPARTMENT_TRANSLATIONS[dept];
  if (trans && trans[code]) return trans[code];
  return dept;
}

// Status Localization Mapping
export const STATUS_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  'Submitted': {
    kn: 'ದಾಖಲಾಗಿದೆ',
    hi: 'दर्ज किया गया',
    ta: 'பதிவு செய்யப்பட்டது',
    te: 'నమోదైంది',
    ml: 'സമർപ്പിച്ചു',
    mr: 'नोंदणीकृत',
    bn: 'জমা হয়েছে',
    gu: 'નોંધાયેલ',
    en: 'Submitted',
  },
  'Under Review': {
    kn: 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
    hi: 'समीक्षाधीन',
    ta: 'பரிசீலனையில்',
    te: 'పరిశీలనలో ఉంది',
    ml: 'പരിശോധനയിൽ',
    mr: 'तपासणी सुरू',
    bn: 'পর্যালোচনাধীন',
    gu: 'ચકાસણી હેઠળ',
    en: 'Under Review',
  },
  'In Progress': {
    kn: 'ಕಾಮಗಾರಿ ಪ್ರಗತಿಯಲ್ಲಿದೆ',
    hi: 'प्रगति पर है',
    ta: 'பணி நடக்கிறது',
    te: 'పురోగతిలో ఉంది',
    ml: 'പുരോഗതിയിൽ',
    mr: 'काम सुरू आहे',
    bn: 'কাজ চলছে',
    gu: 'કામગીરી ચાલુ',
    en: 'In Progress',
  },
  'Resolved': {
    kn: 'ಪರಿಹರಿಸಲಾಗಿದೆ',
    hi: 'समाधान हो गया',
    ta: 'தீர்க்கப்பட்டது',
    te: 'పరిష్కరించబడింది',
    ml: 'പരിഹരിച്ചു',
    mr: 'निवारण झाले',
    bn: 'সমাধান হয়েছে',
    gu: 'ઉકેલાઈ ગયું',
    en: 'Resolved',
  },
  'Closed': {
    kn: 'ಮುಕ್ತಾಯಗೊಳಿಸಲಾಗಿದೆ',
    hi: 'बंद किया गया',
    ta: 'மூடப்பட்டது',
    te: 'మూసివేయబడింది',
    ml: 'അവസാനിപ്പിച്ചു',
    mr: 'बंद केले',
    bn: 'বন্ধ হয়েছে',
    gu: 'બંધ કરેલ',
    en: 'Closed',
  },
  'Escalated': {
    kn: 'ಉನ್ನತಾಧಿಕಾರಿಗಳಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ',
    hi: 'उच्चाधिकारी को प्रेषित',
    ta: 'மேலதிகாரிக்கு அனுப்பப்பட்டது',
    te: 'ఉన్నతాಧಿಕారులకు పంపబడింది',
    ml: 'ഉന്നതാധികാരികൾക്ക് കൈമാറി',
    mr: 'वरिष्ठांकडे वर्ग',
    bn: 'উচ্চতর পদস্থের কাছে পাঠানো হয়েছে',
    gu: 'ઉચ્ચ અધિકારીને મોકલેલ',
    en: 'Escalated',
  },
};

export function locStatus(status: string, lang: LanguageCode | string = 'en'): string {
  if (!status) return '';
  const code = (lang || 'en') as LanguageCode;
  const trans = STATUS_TRANSLATIONS[status];
  if (trans && trans[code]) return trans[code];
  return status;
}

// Priority Localization Mapping
export const PRIORITY_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  'HIGH': {
    kn: 'ತುರ್ತು (HIGH)',
    hi: 'उच्च प्राथमिकता (HIGH)',
    ta: 'உயர் முன்னுரிமை (HIGH)',
    te: 'అత్యవసరం (HIGH)',
    ml: 'ഉയർന്നത് (HIGH)',
    mr: 'उच्च प्राधान्य (HIGH)',
    bn: 'উচ্চ অগ্রাধিকার (HIGH)',
    gu: 'ઉચ્ચ અગ્રતા (HIGH)',
    en: 'HIGH',
  },
  'MEDIUM': {
    kn: 'ಮಧ್ಯಮ (MEDIUM)',
    hi: 'मध्यम प्राथमिकता (MEDIUM)',
    ta: 'நடுத்தர முன்னுரிமை (MEDIUM)',
    te: 'మధ్యస్థం (MEDIUM)',
    ml: 'ഇടത്തരം (MEDIUM)',
    mr: 'मध्यम प्राधान्य (MEDIUM)',
    bn: 'মাঝারি (MEDIUM)',
    gu: 'મધ્યમ અગ્રતા (MEDIUM)',
    en: 'MEDIUM',
  },
  'LOW': {
    kn: 'ಸಾಮಾನ್ಯ (LOW)',
    hi: 'सामान्य प्राथमिकता (LOW)',
    ta: 'குறைந்த முன்னுரிமை (LOW)',
    te: 'సాధారణం (LOW)',
    ml: 'സാധാരണ (LOW)',
    mr: 'कमी प्राधान्य (LOW)',
    bn: 'সাধারণ (LOW)',
    gu: 'સામાન્ય અગ્રતા (LOW)',
    en: 'LOW',
  },
};

export function locPriority(prio: string, lang: LanguageCode | string = 'en'): string {
  if (!prio) return '';
  const code = (lang || 'en') as LanguageCode;
  const trans = PRIORITY_TRANSLATIONS[prio.toUpperCase()];
  if (trans && trans[code]) return trans[code];
  return prio;
}

// Role Localization Mapping
export const ROLE_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  'citizen': {
    kn: 'ನಾಗರಿಕ',
    hi: 'नागरिक',
    ta: 'குடிமகன்',
    te: 'పౌరుడు',
    ml: 'പൗരൻ',
    mr: 'नागरिक',
    bn: 'নাগরিক',
    gu: 'નાગરિક',
    en: 'Citizen',
  },
  'officer': {
    kn: 'ಅಧಿಕಾರಿ',
    hi: 'अधिकारी',
    ta: 'அதிகாரி',
    te: 'అధికారి',
    ml: 'ഓഫീസർ',
    mr: 'अधिकारी',
    bn: 'অফিসার',
    gu: 'અધિકારી',
    en: 'Officer',
  },
  'admin': {
    kn: 'ಆಡಳಿತಾಧಿಕಾರಿ',
    hi: 'प्रशासक',
    ta: 'நிர்வாகி',
    te: 'అడ్మిన్',
    ml: 'അഡ്മിൻ',
    mr: 'प्रशासक',
    bn: 'প্রশাসক',
    gu: 'વહીવટકર્તા',
    en: 'Admin',
  },
};

export function locRole(role: string, lang: LanguageCode | string = 'en'): string {
  if (!role) return '';
  const code = (lang || 'en') as LanguageCode;
  const trans = ROLE_TRANSLATIONS[role.toLowerCase()];
  if (trans && trans[code]) return trans[code];
  return role;
}
